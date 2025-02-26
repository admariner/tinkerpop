﻿#region License

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

#endregion

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Gremlin.Net.Driver.Messages;
using Gremlin.Net.Process.Remote;
using Gremlin.Net.Process.Traversal;
using Gremlin.Net.Process.Traversal.Strategy.Decoration;

namespace Gremlin.Net.Driver.Remote
{
    /// <summary>
    ///     A <see cref="IRemoteConnection" /> implementation for Gremlin Server.
    /// </summary>
    public class DriverRemoteConnection : IRemoteConnection, IDisposable
    {
        private readonly IGremlinClient _client;
        private readonly string _traversalSource;
        
        /// <summary>
        /// Filter on these keys provided to OptionsStrategy and apply them to the request. Note that
        /// "scriptEvaluationTimeout" was deprecated in 3.3.9 but still supported in server implementations and will
        /// be removed in later versions. 
        /// </summary>
        private readonly List<String> _allowedKeys = new List<string> 
                    {Tokens.ArgsEvalTimeout, "scriptEvaluationTimeout", Tokens.ArgsBatchSize, 
                     Tokens.RequestId, Tokens.ArgsUserAgent};

        /// <summary>
        ///     Initializes a new <see cref="IRemoteConnection" /> using "g" as the default remote TraversalSource name.
        /// </summary>
        /// <param name="host">The host to connect to.</param>
        /// <param name="port">The port to connect to.</param>
        /// <exception cref="ArgumentNullException">Thrown when client is null.</exception>
        public DriverRemoteConnection(string host, int port):this(host, port, "g")
        {
        }

        /// <summary>
        ///     Initializes a new <see cref="IRemoteConnection" />.
        /// </summary>
        /// <param name="host">The host to connect to.</param>
        /// <param name="port">The port to connect to.</param>
        /// <param name="traversalSource">The name of the traversal source on the server to bind to.</param>
        /// <exception cref="ArgumentNullException">Thrown when client is null.</exception>
        public DriverRemoteConnection(string host, int port, string traversalSource):this(new GremlinClient(new GremlinServer(host, port)), traversalSource)
        {
        }

        /// <summary>
        ///     Initializes a new <see cref="IRemoteConnection" /> using "g" as the default remote TraversalSource name.
        /// </summary>
        /// <param name="client">The <see cref="IGremlinClient" /> that will be used for the connection.</param>
        /// <exception cref="ArgumentNullException">Thrown when client is null.</exception>
        public DriverRemoteConnection(IGremlinClient client):this(client, "g")
        {
        }

        /// <summary>
        ///     Initializes a new <see cref="IRemoteConnection" />.
        /// </summary>
        /// <param name="client">The <see cref="IGremlinClient" /> that will be used for the connection.</param>
        /// <param name="traversalSource">The name of the traversal source on the server to bind to.</param>
        /// <exception cref="ArgumentNullException">Thrown when client is null.</exception>
        public DriverRemoteConnection(IGremlinClient client, string traversalSource)
        {
            _client = client ?? throw new ArgumentNullException(nameof(client));
            _traversalSource = traversalSource ?? throw new ArgumentNullException(nameof(traversalSource));
        }

        /// <summary>
        ///     Submits <see cref="Bytecode" /> for evaluation to a remote Gremlin Server.
        /// </summary>
        /// <param name="bytecode">The <see cref="Bytecode" /> to submit.</param>
        /// <returns>A <see cref="ITraversal" /> allowing to access the results and side-effects.</returns>
        public async Task<ITraversal<S, E>> SubmitAsync<S, E>(Bytecode bytecode)
        {
            var requestId = Guid.NewGuid();
            var resultSet = await SubmitBytecodeAsync(requestId, bytecode).ConfigureAwait(false);
            return new DriverRemoteTraversal<S, E>(_client, requestId, resultSet);
        }

        private async Task<IEnumerable<Traverser>> SubmitBytecodeAsync(Guid requestid, Bytecode bytecode)
        {
            var requestMsg =
                RequestMessage.Build(Tokens.OpsBytecode)
                    .Processor(Tokens.ProcessorTraversal)
                    .OverrideRequestId(requestid)
                    .AddArgument(Tokens.ArgsGremlin, bytecode)
                    .AddArgument(Tokens.ArgsAliases, new Dictionary<string, string> {{"g", _traversalSource}});

            var optionsStrategyInst = bytecode.SourceInstructions.Find(
                s => s.OperatorName == "withStrategies" && s.Arguments[0] is OptionsStrategy);
            if (optionsStrategyInst != null)
            {
                OptionsStrategy optionsStrategy = optionsStrategyInst.Arguments[0];
                foreach (KeyValuePair<string,dynamic> pair in optionsStrategy.Configuration)
                {
                    if (_allowedKeys.Contains(pair.Key))
                    {
                        requestMsg.AddArgument(pair.Key, pair.Value);
                    }
                }
            }
            
            return await _client.SubmitAsync<Traverser>(requestMsg.Create()).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public void Dispose()
        {
            _client?.Dispose();
        }
    }
}