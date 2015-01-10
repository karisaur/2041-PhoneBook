#!/bin/sh

echo "Access-Control-Allow-Origin: *"
echo "Access-Control-Allow-Methods: GET, POST, OPTIONS"
echo "Access-Control-Allow-Headers: Content-Type"
echo "Content-Type: text/html"
echo ""

/cs/local/bin/javac pb/PBapp.java
/cs/local/bin/java pb.PBapp 2>&1
