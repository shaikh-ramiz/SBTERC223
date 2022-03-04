# SBTERC223

<b>Generate an ".env" file containing following parameter values</b>
<ol>
<li>SERVER_PORT</li>
<li>KOVAN_ENDPOINT</li>
<li>PROJECT_ID</li>
<li>PRIVATE_KEY</li>
<li>MNEMONIC</li>
<li>FOUNDER_WALLET</li>
<li>INVESTOR_ADDRESS</li>
<li>INVESTOR_TOKENS</li>
<li>ADVISOR_ADDRESS</li>
<li>ADVISOR_TOKENS</li>
<li>TEAM_ADDRESS</li>
<li>TEAM_TOKENS</li>
</ol>

Install all the dependencies : "<b>npm install</b>"  

Install ganache: "<b>npm install -D ganache@rc</b>"  
Run Ganache on a terminal (testing purpose): "<b>ganache -a 1 -q -v -b 0 -g 0 -k "byzantium" --miner.coinbase 0</b>"
Configure other endpoints in: <b>truffle-config.js</b>
<b>Note:</b> remove "-q" from command for the logs  

Deploy your contracts: "<b>truffle migrate --reset</b>"  

Run API: "<b>npm run serve</b>"
Test Vesting: "<b>npm run test_vesting</b>" 
