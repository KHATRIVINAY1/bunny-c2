use scrap::{Capturer, Display};
use std::io::ErrorKind::WouldBlock;
use std::thread;
use std::time::{Duration,Instant};
use image::{ImageBuffer, Rgba};
use std::io::Cursor;
use base64::{engine::general_purpose, Engine as _};



pub fn capture() -> (String, String) {
    // Initialize display and capturer
    let display = match Display::primary() {
        Ok(display) => display,
        Err(e) => return (String::new(), format!("Error finding primary display: {}", e)),
    };

    let mut capturer = match Capturer::new(display) {
        Ok(capturer) => capturer,
        Err(e) => return (String::new(), format!("Error creating capturer: {}", e)),
    };

    let (w, h) = (capturer.width(), capturer.height());
    let expected_len = w * h * 4;

    // Set a timeout to prevent infinite loop
    let timeout = Duration::from_secs(5);
    let start_time = Instant::now();

    loop {
        if start_time.elapsed() > timeout {
            return (String::new(), String::from("Error: Capture timed out"));
        }

        match capturer.frame() {
            Ok(frame) => {
                if frame.len() != expected_len {
                    return (String::new(), String::from("Error: Unexpected frame size"));
                }

                // Convert BGRA to RGBA efficiently
                let mut rgba_data = Vec::with_capacity(expected_len);
                for chunk in frame.chunks(4) {
                    rgba_data.extend_from_slice(&[chunk[2], chunk[1], chunk[0], 255]);
                }

                // Create ImageBuffer
                let img = match ImageBuffer::<Rgba<u8>, _>::from_vec(w as u32, h as u32, rgba_data) {
                    Some(img) => img,
                    None => return (String::new(), String::from("Error: Failed to create ImageBuffer")),
                };

                // Encode to PNG
                let mut buf = Cursor::new(Vec::with_capacity(expected_len));
                if let Err(e) = img.write_to(&mut buf, image::ImageOutputFormat::Png) {
                    return (String::new(), format!("Error encoding PNG: {}", e));
                }

                // Convert to Base64
                let png_bytes = buf.into_inner();
                let base64_str = general_purpose::STANDARD.encode(&png_bytes);

                return (base64_str, String::from("Screenshot captured successfully"));
            }
            Err(ref e) if e.kind() == WouldBlock => {
                std::thread::sleep(Duration::from_millis(1)); // Reduced sleep time
                continue;
            }
            Err(e) => {
                return (String::new(), format!("Error capturing frame: {}", e));
            }
        }
    }
}