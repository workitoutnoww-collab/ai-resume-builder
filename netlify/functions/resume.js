exports.handler = async function(event) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 200,
        body: JSON.stringify({ error: "Use POST request" })
      };
    }

    const { input } = JSON.parse(event.body || "{}");

    if (!input) {
      return {
        statusCode: 200,
        body: JSON.stringify({ error: "No input provided" })
      };
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 200,
        body: JSON.stringify({ error: "API key missing" })
      };
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Write 2 strong resume bullet points with action verbs."
          },
          {
            role: "user",
            content: input
          }
        ],
        max_tokens: 100
      })
    });

    const data = await response.json();

    // DEBUG LOG
    console.log("OpenAI response:", data);

    if (!data.choices) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          error: "OpenAI error: " + JSON.stringify(data)
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        output: data.choices[0].message.content
      })
    };

  } catch (err) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        error: err.message
      })
    };
  }
};
