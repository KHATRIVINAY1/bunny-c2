use serde_json::Value;

pub fn get_string_from_json<'a>(json: &'a Value, key: &str) -> Option<&'a str> {
    json.get(key)?.as_str()
}