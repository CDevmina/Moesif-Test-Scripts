# Moesif Test Scripts

A Node.js CLI tool for generating and posting randomized test data to Moesif. This tool helps you create realistic application creation events for testing dashboards, analytics, and data pipelines.

## Features

- 🎲 Generate randomized `application_created` action events
- 📅 Spread event timestamps across the past 30 days (configurable)
- 📤 Post events to Moesif using the bulk `/actions/batch` endpoint
- 🔌 Support for future `/companies/batch` and `/users/batch` endpoints
- 🎯 Configurable event count, output file, and template IDs
- 🔍 Dry-run mode to preview data before posting
- 🛡️ Environment variable support for secure credential management

## Prerequisites

- Node.js (v16 or higher)
- npm (v6 or higher)
- A Moesif account with an Application ID

## Installation

1. Clone the repository:
```bash
git clone https://github.com/CDevmina/Moesif-Test-Scripts.git
cd Moesif-Test-Scripts
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Edit `.env` and add your Moesif Application ID:
```bash
MOESIF_APP_ID=your_moesif_app_id_here
MOESIF_API_URL=https://api.moesif.net/v1
```

## Usage

### Generate Events

Generate a JSON file with randomized application creation events:

```bash
# Generate 100 events (default)
node index.js generate

# Generate a specific number of events
node index.js generate --count 500

# Generate events to a specific file
node index.js generate --output my-events.json

# Generate events with a specific template ID
node index.js generate --template nextjs-application --count 50
```

**Options:**
- `-c, --count <number>`: Number of events to generate (default: 100)
- `-o, --output <path>`: Output file path (default: moesif-events.json)
- `-t, --template <id>`: Specific template ID to use (optional)

### Post Events to Moesif

Post generated events to Moesif:

```bash
# Post events from default file (moesif-events.json)
node index.js post

# Post events from a specific file
node index.js post --file my-events.json

# Dry run - preview without posting
node index.js post --dry-run

# Post to different endpoint types (future use)
node index.js post --type companies
node index.js post --type users
```

**Options:**
- `-f, --file <path>`: Input file path (default: moesif-events.json)
- `-t, --type <type>`: Data type - actions, companies, or users (default: actions)
- `-d, --dry-run`: Preview data without posting

### View Configuration

Display current configuration and sample payload:

```bash
node index.js info
```

## Environment Variables

Create a `.env` file in the project root with the following variables:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MOESIF_APP_ID` | Yes | - | Your Moesif Application ID |
| `MOESIF_API_URL` | No | `https://api.moesif.net/v1` | Moesif API base URL |

## Sample Payload Structure

The generated events follow the Moesif action event schema:

```json
{
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
}
```

### Available Template IDs

The generator includes the following template IDs:
- `nextjs-application`
- `react-spa`
- `vue-application`
- `express-api`
- `django-backend`
- `spring-boot-api`
- `fastapi-service`
- `rails-webapp`

## Example Workflow

```bash
# 1. Generate 200 test events
node index.js generate --count 200

# 2. Preview what will be posted
node index.js post --dry-run

# 3. Post to Moesif
node index.js post

# 4. Verify configuration
node index.js info
```

## API Endpoints

The CLI supports the following Moesif bulk endpoints:

- **Actions**: `POST /actions/batch` - For action events (implemented)
- **Companies**: `POST /companies/batch` - For company data (placeholder)
- **Users**: `POST /users/batch` - For user data (placeholder)

## Error Handling

The CLI provides helpful error messages for common issues:

- Missing `MOESIF_APP_ID` environment variable
- Invalid file paths
- Network errors
- API authentication failures
- Invalid JSON format

## Project Structure

```
Moesif-Test-Scripts/
├── index.js           # Main CLI interface
├── generator.js       # Event data generator
├── moesif-client.js   # Moesif API client
├── package.json       # Project dependencies
├── .env.example       # Environment variable template
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## Development

### Adding New Event Types

To add new event types, modify `generator.js`:

1. Add new template IDs to the `TEMPLATE_IDS` array
2. Create new generation functions as needed
3. Update the event structure in `generateApplicationCreatedEvent()`

### Adding New Endpoints

The `MoesifClient` class in `moesif-client.js` includes placeholder methods for companies and users endpoints. To fully implement:

1. Create generation functions in `generator.js`
2. Update the CLI `post` command to handle new data types
3. Test with sample payloads

## Troubleshooting

**Events not appearing in Moesif?**
- Verify your `MOESIF_APP_ID` is correct
- Check that the API URL is accessible
- Review the console output for error messages
- Try a dry-run first to verify data structure

**JSON parsing errors?**
- Ensure the generated file is valid JSON
- Check that the file wasn't manually edited incorrectly
- Regenerate the file if needed

## License

MIT

## Support

For issues or questions:
- Open an issue on GitHub
- Check Moesif documentation: https://www.moesif.com/docs/
- Contact Moesif support

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
