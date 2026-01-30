#!/usr/bin/env node

/**
 * Moesif Test Scripts CLI
 * Generate and post randomized test data to Moesif
 */

require('dotenv').config();
const { Command } = require('commander');
const fs = require('fs').promises;
const path = require('path');
const { generateBulkEvents } = require('./generator');
const MoesifClient = require('./moesif-client');

const program = new Command();

program
  .name('moesif-test-scripts')
  .description('CLI tool for generating and posting randomized Moesif test data')
  .version('1.0.0');

/**
 * Generate command - creates a JSON file with randomized events
 */
program
  .command('generate')
  .description('Generate randomized application_created events')
  .option('-c, --count <number>', 'Number of events to generate', '100')
  .option('-o, --output <path>', 'Output file path', 'moesif-events.json')
  .option('-t, --template <id>', 'Specific template ID to use (optional)')
  .action(async (options) => {
    try {
      const count = parseInt(options.count, 10);
      
      if (isNaN(count) || count <= 0) {
        console.error('❌ Error: Count must be a positive number');
        process.exit(1);
      }

      console.log(`🔄 Generating ${count} application_created events...`);
      
      const generatorOptions = {};
      if (options.template) {
        generatorOptions.templateId = options.template;
        console.log(`   Using template: ${options.template}`);
      }
      
      const events = generateBulkEvents(count, generatorOptions);
      
      const outputPath = path.resolve(options.output);
      await fs.writeFile(outputPath, JSON.stringify(events, null, 2));
      
      console.log(`✅ Successfully generated ${events.length} events`);
      console.log(`📁 Saved to: ${outputPath}`);
      console.log(`📊 Time range: ${events[0].request.time} to ${events[events.length - 1].request.time}`);
    } catch (error) {
      console.error('❌ Error generating events:', error.message);
      process.exit(1);
    }
  });

/**
 * Post command - reads events from a JSON file and posts to Moesif
 */
program
  .command('post')
  .description('Post events to Moesif from a JSON file')
  .option('-f, --file <path>', 'Input file path', 'moesif-events.json')
  .option('-t, --type <type>', 'Data type: actions, companies, or users', 'actions')
  .option('-d, --dry-run', 'Dry run - show what would be posted without actually posting')
  .action(async (options) => {
    try {
      const filePath = path.resolve(options.file);
      
      console.log(`📖 Reading events from: ${filePath}`);
      
      const fileContent = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(fileContent);
      
      if (!Array.isArray(data)) {
        console.error('❌ Error: File must contain an array of events');
        process.exit(1);
      }
      
      console.log(`📦 Found ${data.length} events in file`);
      
      if (options.dryRun) {
        console.log('\n🔍 DRY RUN MODE - No data will be posted');
        if (data.length > 0) {
          console.log('\nSample event:');
          console.log(JSON.stringify(data[0], null, 2));
        }
        console.log(`\nWould post ${data.length} events to Moesif ${options.type} endpoint`);
        return;
      }
      
      const appId = process.env.MOESIF_APP_ID;
      const apiUrl = process.env.MOESIF_API_URL || 'https://api.moesif.net/v1';
      
      if (!appId) {
        console.error('❌ Error: MOESIF_APP_ID environment variable is not set');
        console.error('   Please create a .env file with your Moesif Application ID');
        console.error('   Example: MOESIF_APP_ID=your_app_id_here');
        process.exit(1);
      }
      
      console.log(`🔗 Connecting to: ${apiUrl}`);
      const client = new MoesifClient(appId, apiUrl);
      
      console.log(`🚀 Posting ${data.length} events to Moesif...`);
      
      let result;
      switch (options.type) {
        case 'actions':
          result = await client.postActionsBatch(data);
          break;
        case 'companies':
          result = await client.postCompaniesBatch(data);
          break;
        case 'users':
          result = await client.postUsersBatch(data);
          break;
        default:
          console.error(`❌ Error: Invalid type "${options.type}". Must be: actions, companies, or users`);
          process.exit(1);
      }
      
      if (result.success) {
        console.log(`✅ Successfully posted ${data.length} events`);
        console.log(`📡 Status: ${result.status}`);
        if (result.data) {
          console.log(`📊 Response:`, JSON.stringify(result.data, null, 2));
        }
      } else {
        console.error(`❌ Failed to post events`);
        console.error(`   Error: ${result.error}`);
        if (result.status) {
          console.error(`   Status: ${result.status}`);
        }
        if (result.data) {
          console.error(`   Details:`, JSON.stringify(result.data, null, 2));
        }
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Error posting events:', error.message);
      process.exit(1);
    }
  });

/**
 * Info command - display configuration and sample payload
 */
program
  .command('info')
  .description('Display configuration and sample payload structure')
  .action(() => {
    const appId = process.env.MOESIF_APP_ID;
    const apiUrl = process.env.MOESIF_API_URL || 'https://api.moesif.net/v1';
    
    console.log('\n📋 Moesif Test Scripts Configuration\n');
    console.log('Environment Variables:');
    console.log(`  MOESIF_APP_ID: ${appId ? '✅ Set' : '❌ Not set'}`);
    console.log(`  MOESIF_API_URL: ${apiUrl}`);
    
    console.log('\nEndpoints:');
    console.log(`  Actions: ${apiUrl}/actions/batch`);
    console.log(`  Companies: ${apiUrl}/companies/batch`);
    console.log(`  Users: ${apiUrl}/users/batch`);
    
    console.log('\nSample application_created event structure:');
    console.log(`{
  "action_name": "application_created",
  "user_id": "user_1234567890_abc123",
  "company_id": "company_1234567890_def456",
  "request": {
    "time": "2024-01-15T10:30:00.000Z"
  },
  "metadata": {
    "template_id": "nextjs-application",
    "application_id": "app_1234567890_ghi789",
    "application_name": "dashboard-x7k2p",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}`);
  });

program.parse();
