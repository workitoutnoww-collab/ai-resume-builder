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

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Write 2 powerful resume bullet points using action verbs and measurable impact."
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

    return {
      statusCode: 200,
      body: JSON.stringify({
        output: data.choices?.[0]?.message?.content || "No response from AI"
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
