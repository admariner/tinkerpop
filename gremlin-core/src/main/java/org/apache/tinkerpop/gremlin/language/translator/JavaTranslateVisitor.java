/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package org.apache.tinkerpop.gremlin.language.translator;

import org.antlr.v4.runtime.tree.ParseTree;
import org.antlr.v4.runtime.tree.TerminalNode;
import org.apache.tinkerpop.gremlin.language.grammar.GremlinParser;
import org.apache.tinkerpop.gremlin.process.traversal.strategy.decoration.OptionsStrategy;
import org.apache.tinkerpop.gremlin.structure.util.reference.ReferenceVertex;
import org.apache.tinkerpop.gremlin.util.DatetimeHelper;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Converts a Gremlin traversal string into a Java source code representation of that traversal with an aim at
 * sacrificing some formatting for the ability to compile correctly.
 * <ul>
 *     <li>Range syntax has no direct support</li>
 *     <li>Normalizes whitespace</li>
 *     <li>Normalize numeric suffixes to lower case</li>
 *     <li>If floats are not suffixed they will translate as BigDecimal</li>
 *     <li>Makes anonymous traversals explicit with double underscore</li>
 *     <li>Makes enums explicit with their proper name</li>
 * </ul>
 */
public class JavaTranslateVisitor extends AbstractTranslateVisitor {
    private static final String vertexClassName = ReferenceVertex.class.getSimpleName();

    public JavaTranslateVisitor() {
        super("g");
    }

    public JavaTranslateVisitor(final String graphTraversalSourceName) {
        super(graphTraversalSourceName);
    }

    @Override
    public Void visitTraversalStrategy(final GremlinParser.TraversalStrategyContext ctx) {
        if (ctx.getChildCount() == 1)
            sb.append(ctx.getText()).append(".instance()");
        else {
            visit(ctx.classType());
            sb.append(".build()");

            final List<ParseTree> configs = ctx.children.stream().
                    filter(c -> c instanceof GremlinParser.ConfigurationContext).collect(Collectors.toList());

            if (configs.size() > 0 && ctx.getChild(1).getText().equals(OptionsStrategy.class.getSimpleName())) {
                for (int ix = 0; ix < configs.size(); ix++) {
                    sb.append(".with(\"");
                    sb.append(configs.get(ix).getChild(0).getText());
                    sb.append("\", ");
                    visit(configs.get(ix).getChild(2));
                    sb.append(")");
                }
            } else {
                // the rest are the arguments to the strategy
                for (ParseTree config : configs) {
                    sb.append(".");
                    visit(config);
                }
            }

            sb.append(".create()");
        }

        return null;
    }

    @Override
    public Void visitConfiguration(final GremlinParser.ConfigurationContext ctx) {
        // form of three tokens of key:value to become key(value)
        sb.append(ctx.getChild(0).getText()).append("(");
        visit(ctx.getChild(2));
        sb.append(")");
        return null;
    }

    @Override
    public Void visitClassType(final GremlinParser.ClassTypeContext ctx) {
        // require different handling based on the parent. if used inside of withoutStrategies() then it needs
        // a class reference, otherwise it's just a keyword.
        if (ctx.getParent() instanceof GremlinParser.TraversalSourceSelfMethod_withoutStrategiesContext ||
            ctx.getParent() instanceof GremlinParser.ClassTypeExprContext)
            sb.append(ctx.getText()).append(".class");
        else
            sb.append(ctx.getText());

        return null;
    }

    @Override
    public Void visitGenericMapLiteral(final GremlinParser.GenericMapLiteralContext ctx) {
        sb.append("new LinkedHashMap<Object, Object>() {{ ");
        for (int i = 0; i < ctx.mapEntry().size(); i++) {
            final GremlinParser.MapEntryContext mapEntryContext = ctx.mapEntry(i);
            visit(mapEntryContext);
            if (i < ctx.mapEntry().size() - 1)
                sb.append(" ");
        }
        sb.append(" }}");
        return null;
    }

    @Override
    public Void visitMapEntry(final GremlinParser.MapEntryContext ctx) {
        sb.append("put(");
        visit(ctx.mapKey());
        sb.append(", ");
        visit(ctx.genericLiteral()); // value
        sb.append(");");
        return null;
    }

    @Override
    public Void visitMapKey(final GremlinParser.MapKeyContext ctx) {
        final int keyIndex = ctx.LPAREN() != null && ctx.RPAREN() != null ? 1 : 0;
        visit(ctx.getChild(keyIndex));
        return null;
    }

    @Override
    public Void visitDateLiteral(final GremlinParser.DateLiteralContext ctx) {
        // child at 2 is the date argument to datetime() and comes enclosed in quotes
        final String dtString = ctx.getChild(2).getText();
        final OffsetDateTime dt = DatetimeHelper.parse(removeFirstAndLastCharacters(dtString));
        sb.append("OffsetDateTime.parse(\"");
        sb.append(dt);
        sb.append("\")");
        return null;
    }

    @Override
    public Void visitNanLiteral(final GremlinParser.NanLiteralContext ctx) {
        sb.append("Double.NaN");
        return null;
    }

    @Override
    public Void visitInfLiteral(final GremlinParser.InfLiteralContext ctx) {
        if (ctx.SignedInfLiteral() != null && ctx.SignedInfLiteral().getText().equals("-Infinity"))
            sb.append("Double.NEGATIVE_INFINITY");
        else
            sb.append("Double.POSITIVE_INFINITY");
        return null;
    }

    @Override
    public Void visitIntegerLiteral(final GremlinParser.IntegerLiteralContext ctx) {
        final String integerLiteral = ctx.getText().toLowerCase();

        // check suffix
        final int lastCharIndex = integerLiteral.length() - 1;
        final char lastCharacter = integerLiteral.charAt(lastCharIndex);
        switch (lastCharacter) {
            case 'b':
                // parse B/b as byte
                sb.append("new Byte(");
                sb.append(integerLiteral, 0, lastCharIndex);
                sb.append(")");
                break;
            case 's':
                // parse S/s as short
                sb.append("new Short(");
                sb.append(integerLiteral, 0, lastCharIndex);
                sb.append(")");
                break;
            case 'i':
                // parse I/i as integer
                sb.append(integerLiteral, 0, lastCharIndex);
                break;
            case 'l':
                // parse L/l as long
                sb.append(integerLiteral);
                break;
            case 'n':
                // parse N/n as BigInteger
                sb.append("new BigInteger(\"");
                sb.append(integerLiteral, 0, lastCharIndex);
                sb.append("\")");
                break;
            default:
                // everything else just goes as specified
                sb.append(integerLiteral);
                break;
        }
        return null;
    }

    @Override
    public Void visitFloatLiteral(final GremlinParser.FloatLiteralContext ctx) {
        if (ctx.infLiteral() != null) return visit(ctx.infLiteral());
        if (ctx.nanLiteral() != null) return visit(ctx.nanLiteral());

        final String floatLiteral = ctx.getText().toLowerCase();

        // check suffix
        final int lastCharIndex = floatLiteral.length() - 1;
        final char lastCharacter = floatLiteral.charAt(lastCharIndex);
        switch (lastCharacter) {
            case 'f':
            case 'd':
                // parse F/f as Float and D/d suffix as Double
                sb.append(floatLiteral);
                break;
            case 'm':
                // parse M/m or whatever which could be a parse exception
                sb.append("new BigDecimal(\"");
                sb.append(floatLiteral, 0, lastCharIndex);
                sb.append("\")");
                break;
            default:
                // everything else just goes as specified
                sb.append(floatLiteral);
                break;
        }
        return null;
    }

    @Override
    public Void visitGenericRangeLiteral(final GremlinParser.GenericRangeLiteralContext ctx) {
        throw new TranslatorException("Java does not support range literals");
    }

    @Override
    public Void visitGenericSetLiteral(final GremlinParser.GenericSetLiteralContext ctx) {
        sb.append("new HashSet<Object>() {{ ");
        for (int i = 0; i < ctx.genericLiteral().size(); i++) {
            final GremlinParser.GenericLiteralContext genericLiteralContext = ctx.genericLiteral(i);
            sb.append("add(");
            visit(genericLiteralContext);
            sb.append(");");
            if (i < ctx.genericLiteral().size() - 1)
                sb.append(" ");
        }
        sb.append(" }}");
        return null;
    }

    @Override
    public Void visitGenericCollectionLiteral(final GremlinParser.GenericCollectionLiteralContext ctx) {
        sb.append("new ArrayList<Object>() {{ ");
        for (int i = 0; i < ctx.genericLiteral().size(); i++) {
            final GremlinParser.GenericLiteralContext genericLiteralContext = ctx.genericLiteral(i);
            sb.append("add(");
            visit(genericLiteralContext);
            sb.append(");");
            if (i < ctx.genericLiteral().size() - 1)
                sb.append(" ");
        }
        sb.append(" }}");
        return null;
    }
}
