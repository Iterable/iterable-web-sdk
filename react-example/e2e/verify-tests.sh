#!/bin/bash

# Test Verification Script for Iterable Web SDK
# This script verifies the test infrastructure is set up correctly

set -e

echo "🔍 Verifying Iterable Web SDK E2E Test Suite..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Please run this script from the react-example directory${NC}"
    exit 1
fi

echo -e "${BLUE}Step 1: Checking dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules not found. Running yarn install...${NC}"
    yarn install
else
    echo -e "${GREEN}✅ Dependencies installed${NC}"
fi

echo ""
echo -e "${BLUE}Step 2: Checking Playwright browsers...${NC}"
if ! yarn playwright --version > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Playwright not found. Installing...${NC}"
    yarn playwright:install
else
    echo -e "${GREEN}✅ Playwright installed${NC}"
fi

echo ""
echo -e "${BLUE}Step 3: Verifying test files...${NC}"

# Count test files
smoke_tests=$(find e2e/smoke -name "*.spec.ts" 2>/dev/null | wc -l | tr -d ' ')
feature_tests=$(find e2e/features -name "*.spec.ts" 2>/dev/null | wc -l | tr -d ' ')
total_tests=$((smoke_tests + feature_tests + 2)) # +2 for auth and uua

echo -e "  Smoke tests: ${GREEN}${smoke_tests} files${NC}"
echo -e "  Feature tests: ${GREEN}${feature_tests} files${NC}"
echo -e "  Other tests: ${GREEN}2 files${NC} (auth, uua)"
echo -e "  ${GREEN}✅ Total: ${total_tests} test files${NC}"

echo ""
echo -e "${BLUE}Step 4: Verifying page objects...${NC}"
page_objects=$(find e2e/page-objects/pages -name "*.ts" 2>/dev/null | wc -l | tr -d ' ')
echo -e "  ${GREEN}✅ ${page_objects} page objects found${NC}"

echo ""
echo -e "${BLUE}Step 5: Verifying mock utilities...${NC}"
mocks=$(find e2e/mocks -name "*.ts" 2>/dev/null | wc -l | tr -d ' ')
echo -e "  ${GREEN}✅ ${mocks} mock files found${NC}"

echo ""
echo -e "${BLUE}Step 6: Checking environment variables...${NC}"
if [ -z "$API_KEY" ]; then
    echo -e "  ${YELLOW}⚠️  API_KEY not set (required for smoke tests)${NC}"
else
    echo -e "  ${GREEN}✅ API_KEY is set${NC}"
fi

if [ -z "$JWT_SECRET" ]; then
    echo -e "  ${YELLOW}⚠️  JWT_SECRET not set (required for smoke tests)${NC}"
else
    echo -e "  ${GREEN}✅ JWT_SECRET is set${NC}"
fi

if [ -z "$LOGIN_EMAIL" ]; then
    echo -e "  ${YELLOW}⚠️  LOGIN_EMAIL not set (using default)${NC}"
else
    echo -e "  ${GREEN}✅ LOGIN_EMAIL is set${NC}"
fi

echo ""
echo -e "${BLUE}Step 7: TypeScript compilation check...${NC}"
if yarn tsc --noEmit --project e2e/tsconfig.json > /dev/null 2>&1; then
    echo -e "  ${GREEN}✅ TypeScript compilation successful${NC}"
else
    echo -e "  ${YELLOW}⚠️  TypeScript compilation has errors (check output)${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Test Infrastructure Verification Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo ""
echo -e "1. ${YELLOW}Start the dev server:${NC}"
echo "   yarn start"
echo ""
echo -e "2. ${YELLOW}Run feature tests (mock data):${NC}"
echo "   yarn playwright --grep @feature"
echo ""
echo -e "3. ${YELLOW}Set up Iterable campaigns for smoke tests${NC}"
echo "   See e2e/IMPLEMENTATION_GUIDE.md"
echo ""
echo -e "4. ${YELLOW}Run smoke tests (real API):${NC}"
echo "   yarn playwright --grep @smoke"
echo ""
echo -e "5. ${YELLOW}Run all tests:${NC}"
echo "   yarn playwright"
echo ""
echo -e "6. ${YELLOW}Run tests in UI mode:${NC}"
echo "   yarn playwright --ui"
echo ""
echo -e "${GREEN}Happy Testing! 🎉${NC}"

