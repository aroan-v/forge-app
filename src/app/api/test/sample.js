// Import the custom file helper functions: readFile and writeFile
// These are likely wrappers around Node's fs module or similar,
// abstracting the file reading and writing logic.
import { readFile, writeFile } from '@/helpers/file-helpers'

// Define the GET handler for reading the data from a file.
// This is typically triggered when a client sends a GET request.
export async function GET() {
  try {
    // Attempt to read the contents of the JSON file as a string.
    const data = readFile('src/database.json')

    // Return a successful HTTP response (200) with the file data as JSON.
    return new Response(data, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    // If any error occurs (e.g., file not found or read error),
    // respond with an error message and status code 500 (Internal Server Error).
    return new Response(
      JSON.stringify({ error: 'Error reading file' }), // Send a JSON-formatted error message
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

// Define the POST handler for saving data to a file.
// This is triggered when a client sends a POST request with a JSON body.
export async function POST(req) {
  try {
    // Parse the incoming request body as JSON.
    const body = await req.json()

    // Write the parsed data to a JSON file.
    // The third parameter in JSON.stringify (null, 2) formats the JSON with 2-space indentation.
    writeFile('src/database.json', JSON.stringify(body, null, 2))

    // Respond with a success message and HTTP status 200.
    return new Response(JSON.stringify({ message: 'Saved successfully' }), { status: 200 })
  } catch (err) {
    // If writing fails (e.g., file permission issue),
    // respond with a plain text error message and status code 500.
    return new Response('Error writing file', { status: 500 })
  }
}
