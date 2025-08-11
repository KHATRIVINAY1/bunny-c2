use reqwest::blocking::Client;
use reqwest::Method;
use serde::Serialize;
use serde_json::Value;
use std::error::Error;

pub fn send_json_request<T: Serialize>(
    method: Method,
    url: &str,
    body: Option<&T>,
) -> Result<Value, Box<dyn Error>> {
    let client = Client::new();
    let mut request = client.request(method, url);

    if let Some(data) = body {
        request = request.json(data);
    }

    let response_json = request.send()?.json::<Value>()?;
    Ok(response_json)
}