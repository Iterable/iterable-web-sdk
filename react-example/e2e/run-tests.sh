#!/bin/bash

# Playwright Test Runner Script for Iterable Web SDK
# This script provides convenient commands to run the working test suites

set -e

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Iterable Web SDK - Playwright Test Runner${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if dev server is running
check_server() {
    if ! curl -s http://localhost:8080 > /dev/null 2>&1; then
        echo -e "${RED}❌ Development server is not running at http://localhost:8080${NC}"
        echo -e "${YELLOW}Please start the dev server with: cd react-example && yarn start${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Development server is running${NC}\n"
}

# Parse command line arguments
COMMAND=${1:-all}

case $COMMAND in
    auth)
        echo -e "${BLUE}Running authentication tests...${NC}"
        check_server
        npx playwright test e2e/authentication.spec.ts --project=chromium
        ;;
    
    uua)
        echo -e "${BLUE}Running UUA tests...${NC}"
        check_server
        npx playwright test e2e/uua-testing.spec.ts --project=chromium
        ;;
    
    all)
        echo -e "${BLUE}Running all tests on Chromium...${NC}"
        check_server
        npx playwright test --project=chromium
        ;;
    
    all-browsers)
        echo -e "${BLUE}Running all tests on all browsers...${NC}"
        check_server
        npx playwright test
        ;;
    
    debug)
        echo -e "${BLUE}Running tests in debug mode...${NC}"
        check_server
        npx playwright test --debug
        ;;
    
    ui)
        echo -e "${BLUE}Opening Playwright UI mode...${NC}"
        check_server
        npx playwright test --ui
        ;;
    
    report)
        echo -e "${BLUE}Opening test report...${NC}"
        npx playwright show-report
        ;;
    
    help|--help|-h)
        echo "Usage: ./run-tests.sh [command]"
        echo ""
        echo "Commands:"
        echo "  auth              Run authentication tests"
        echo "  uua               Run UUA (Unknown User Activation) tests"
        echo "  all               Run all tests on Chromium (default)"
        echo "  all-browsers      Run all tests on all browsers"
        echo "  debug             Run tests in debug mode"
        echo "  ui                Open Playwright UI mode"
        echo "  report            Show test report"
        echo "  help              Show this help message"
        echo ""
        echo "Examples:"
        echo "  ./run-tests.sh auth"
        echo "  ./run-tests.sh all"
        echo "  ./run-tests.sh debug"
        ;;
    
    *)
        echo -e "${RED}Unknown command: $COMMAND${NC}"
        echo "Run './run-tests.sh help' for usage information"
        exit 1
        ;;
esac

echo -e "\n${GREEN}Done!${NC}"
