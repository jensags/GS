<?php

return [
    'paths' => ['api/*'], // Apply CORS to API routes
    'allowed_methods' => ['*'], // Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    'allowed_origins' => ['*'], // Allow requests from any origin (change '*' to specific domains for security)
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'], // Allow all headers
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
