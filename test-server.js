#!/usr/bin/env node

/**
 * Test script for m0x-context MCP server
 * Run: node test-server.js
 */

const SERVER_URL = 'http://localhost:3000/mcp';

async function testServer() {
    console.log('🧪 Testing m0x-context MCP Server...\n');

    // Test 1: Ping
    console.log('1️⃣ Testing ping endpoint...');
    try {
        const pingResponse = await fetch('http://localhost:3000/ping');
        const pingData = await pingResponse.text();
        console.log(`✅ Ping: ${pingData}\n`);
    } catch (error) {
        console.log(`❌ Ping failed: ${error.message}\n`);
        return;
    }

    // Test 2: List tools
    console.log('2️⃣ Testing MCP tools/list...');
    try {
        const toolsResponse = await fetch(SERVER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
        const searchResponse = await fetch(SERVER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
    console.log('📝 Next steps:');
    console.log('   1. Deploy to Railway: railway up');
    console.log('   2. Add custom domain: mcp.m0x.in');
    console.log('   3. Test with LM Studio');
}

testServer().catch(console.error);
