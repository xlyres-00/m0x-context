// Test script for Context7 MCP Server
// Run with: node test-mcp.js

const API_URL = 'http://localhost:3000/mcp';

async function testMCP() {
    console.log('🧪 Testing Context7 MCP Server\n');

    // Test 1: Initialize connection
    console.log('Test 1: Initialize MCP connection');
    const initResponse = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/event-stream'
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'initialize',
            params: {
                protocolVersion: '2024-11-05',
                capabilities: {},
                clientInfo: {
                    name: 'test-client',
                    version: '1.0.0'
                }
            }
        })
    });

    const initData = await initResponse.json();
    console.log('✅ Initialize response:', JSON.stringify(initData, null, 2));
    console.log('\n---\n');

    // Test 2: List available tools
    console.log('Test 2: List available tools');
    const toolsResponse = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 2,
            method: 'tools/list',
            params: {}
        })
    });

    const toolsData = await toolsResponse.json();
    console.log('✅ Available tools:');
    if (toolsData.result && toolsData.result.tools) {
        toolsData.result.tools.forEach(tool => {
            console.log(`  - ${tool.name}: ${tool.description.split('\n')[0]}`);
        });
    }
    console.log('\n---\n');

    // Test 3: Resolve library ID (search for React)
    console.log('Test 3: Resolve library ID for "React"');
    const resolveResponse = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 3,
            method: 'tools/call',
            params: {
                name: 'resolve-library-id',
                arguments: {
                    query: 'How to use hooks in React',
                    libraryName: 'React'
                }
            }
        })
    });

    const resolveData = await resolveResponse.json();
    console.log('✅ Library resolution result:');
    if (resolveData.result && resolveData.result.content) {
        const text = resolveData.result.content[0].text;
        // Show first 500 characters
        console.log(text.substring(0, 500) + '...\n');
    } else if (resolveData.error) {
        console.log('❌ Error:', resolveData.error.message);
    } else {
        console.log(JSON.stringify(resolveData, null, 2));
    }
    console.log('\n---\n');

    // Test 4: Query documentation (using a known library ID)
    console.log('Test 4: Query docs for Next.js');
    const queryResponse = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 4,
            method: 'tools/call',
            params: {
                name: 'query-docs',
                arguments: {
                    libraryId: '/vercel/next.js',
                    query: 'How to create middleware'
                }
            }
        })
    });

    const queryData = await queryResponse.json();
    console.log('✅ Documentation query result:');
    if (queryData.result && queryData.result.content) {
        const text = queryData.result.content[0].text;
        // Show first 800 characters
        console.log(text.substring(0, 800) + '...\n');
    } else if (queryData.error) {
        console.log('❌ Error:', queryData.error.message);
    } else {
        console.log(JSON.stringify(queryData, null, 2));
    }

    console.log('\n✅ All tests completed!');
}

testMCP().catch(error => {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
});
