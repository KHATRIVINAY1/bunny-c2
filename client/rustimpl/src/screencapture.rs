use std::io::ErrorKind::WouldBlock;
use std::time::{Duration,Instant};
use image::{ImageBuffer, Rgba};
use base64::{engine::general_purpose, Engine as _};
use screenshots::Screen;
use image::{DynamicImage, ImageOutputFormat};
use std::io::Cursor;



pub fn capture() -> (String, String) {
    // Get all screens
    let screens = Screen::all().unwrap();

    let screen = &screens[0];

    let image = screen.capture().unwrap();

    let dyn_img = DynamicImage::ImageRgba8(image);

    // Encode as PNG into memory
    let mut buf = Cursor::new(Vec::new());
    dyn_img
        .write_to(&mut buf, ImageOutputFormat::Png)
        .unwrap();

    // Base64 encode
    let encoded = general_purpose::STANDARD.encode(buf.get_ref());

    return (encoded, "screenshot".to_string());
}