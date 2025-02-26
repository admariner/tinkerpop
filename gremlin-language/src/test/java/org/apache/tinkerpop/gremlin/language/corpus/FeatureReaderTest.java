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
package org.apache.tinkerpop.gremlin.language.corpus;

import org.javatuples.Pair;
import org.junit.Test;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.function.BiFunction;
import java.util.regex.Pattern;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.number.OrderingComparison.greaterThan;
import static org.junit.Assert.assertEquals;

public class FeatureReaderTest {

    @Test
    public void shouldParseInSameOrder() throws IOException {
        final String projectRoot = "../";
        final Map<String,List<String>> gremlins = FeatureReader.parse(projectRoot);
        assertThat(gremlins.size(), greaterThan(0));
        assertEquals(gremlins, FeatureReader.parse(projectRoot));
    }

    @Test
    public void shouldParseAndEmbed() throws IOException {
        final String replaceToken = "****replaced****";
        final List<Pair<Pattern, BiFunction<String, String, String>>> parameterMatchers = new ArrayList<>();
        parameterMatchers.add(Pair.with(Pattern.compile("(.*)"), (k, v) -> replaceToken));
        final String projectRoot = "../";
        final Map<String,List<String>> gremlins = FeatureReader.parse(projectRoot, parameterMatchers);

        // at least one of these things must have the "replaced" token
        assertThat(gremlins.values().stream().
                flatMap(Collection::stream).anyMatch(gremlin -> gremlin.contains(replaceToken)), is(true));
    }
}
