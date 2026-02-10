#!/usr/bin/env node

/**
 * Test script for m0x-context MCP server (Railway deployment)
 * Usage: node test-railway.js https://your-app.up.railway.app
 */

const SERVER_URL = process.argv[2] || 'https://web-production-5e85c.up.railway.app';
const MCP_ENDPOINT = `${SERVER_URL}/mcp`;
const PING_ENDPOINT = `${SERVER_URL}/ping`;

async function testRailwayServer() {
    console.log('🚂 Testing m0x-context on Railway...');
    console.log(`📡 Server URL: ${SERVER_URL}\n`);

    // Test 1: Ping
    console.log('1️⃣ Testing ping endpoint...');
    try {
        const pingResponse = await fetch(PING_ENDPOINT);
        const pingData = await pingResponse.text();
        console.log(`✅ Ping: ${pingData}`);
        console.log(`   URL: ${PING_ENDPOINT}\n`);
    } catch (error) {
        console.log(`❌ Ping failed: ${error.message}`);
        console.log(`   Make sure your Railway app is deployed and running!\n`);
        return;
    }

    // Test 2: List tools
    console.log('2️⃣ Testing MCP tools/list...');
    try {
        const toolsResponse = await fetch(MCP_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/event-stream'
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'tools/list'
            })
        });
        const toolsData = await toolsResponse.json();
        console.log(`✅ Tools available: ${toolsData.result?.tools?.length || 0}`);
        toolsData.result?.tools?.forEach(tool => {
            console.log(`   - ${tool.name}`);
        });
        console.log();
    } catch (error) {
        console.log(`❌ Tools list failed: ${error.message}\n`);
    }

    // Test 3: Search for React
    console.log('3️⃣ Testing library search (React)...');
    try {
        const searchResponse = await fetch(MCP_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/event-stream'
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 2,
                method: 'tools/call',
                params: {
                    name: 'resolve-library-id',
                    arguments: {
                        query: 'How to use React hooks?',
                        libraryName: 'react'
                    }
                }
            })
        });
        const searchData = await searchResponse.json();

        if (searchData.result?.content?.[0]?.text) {
            const results = JSON.parse(searchData.result.content[0].text);
            console.log(`✅ Found ${results.length} React libraries`);
            if (results[0]) {
                console.log(`   Top result: ${results[0].name} (${results[0].id})`);
            }
        } else {
            console.log(`❌ Search failed:`, searchData.error || 'Unknown error');
        }
        console.log();
    } catch (error) {
        console.log(`❌ Search failed: ${error.message}\n`);
    }

    console.log('✅ Testing complete!\n');
    console.log('🎉 Your Railway deployment is working!');
    console.log('\n📝 Next steps:');
    console.log('   1. Add custom domain: mcp.m0x.in');
    console.log('   2. Use in LM Studio:');
    console.log(`      "url": "${MCP_ENDPOINT}"`);
}

if (!process.argv[2]) {
    console.log('❌ Please provide your Railway URL:');
    console.log('   node test-railway.js https://your-app.up.railway.app\n');
    process.exit(1);
}

testRailwayServer().catch(console.error);
