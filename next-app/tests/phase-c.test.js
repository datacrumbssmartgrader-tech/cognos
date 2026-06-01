#!/usr/bin/env node

/**
 * Phase C — Menu + Cloudinary Tests
 * Tests menu CRUD endpoints and image upload
 */

const { TestSuite, request, login, waitForServer } = require("./utils.js");

async function runTests() {
  try {
    // Wait for server to be ready
    await waitForServer();

    const suite = new TestSuite("Phase C — Menu + Cloudinary Tests");

    // Get authenticated session
    let session;

    // Setup: Login before running tests
    suite.test("Setup: Login to get admin session", async () => {
      session = await login("1234");
      if (!session.user) throw new Error("Login failed");
    });

    // Test 1: Upload image to Cloudinary
    suite.test("Upload image → returns URL + public_id", async () => {
      // Create a simple test file
      const formData = new FormData();
      const blob = new Blob(["test image data"], { type: "image/jpeg" });
      formData.append("file", blob, "test.jpg");

      const response = await fetch("http://localhost:3000/api/upload/image", {
        method: "POST",
        body: formData,
        headers: {
          Cookie: `rw_session=${session.token}`,
        },
      });

      const data = await response.json();
      if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
      if (!data.url) throw new Error("No URL in response");
      if (!data.public_id) throw new Error("No public_id in response");
    });

    // Test 2: Create menu item
    suite.test("Create menu item → inserted in database", async () => {
      const response = await request("POST", "/api/admin/menu", {
        body: {
          name: "Test Kebab",
          category: "grills",
          price: 1500,
          description: "Test item",
          image_url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
          image_public_id: "test-image",
          type: "single",
        },
        cookies: session.cookies,
      });

      if (response.status !== 201 && response.status !== 200)
        throw new Error(`Expected 200/201, got ${response.status}`);
      if (!response.data.id) throw new Error("No item ID in response");
    });

    // Test 3: Get all menu items (admin - includes hidden)
    suite.test("Get admin menu → includes all items", async () => {
      const response = await request("GET", "/api/admin/menu", {
        cookies: session.cookies,
      });

      if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
      if (!Array.isArray(response.data)) throw new Error("Response is not an array");
      if (response.data.length === 0) throw new Error("No menu items returned");
    });

    // Test 4: Get public menu (excludes hidden items)
    suite.test("Get public menu → excludes hidden items", async () => {
      const response = await request("GET", "/api/menu");

      if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
      if (!Array.isArray(response.data)) throw new Error("Response is not an array");

      // Check that hidden items are not included
      const hiddenItems = response.data.filter((item) => item.hidden === true);
      if (hiddenItems.length > 0) throw new Error("Hidden items in public menu");
    });

    // Test 5: Update menu item
    suite.test("Update menu item → changes persisted", async () => {
      // First, get an item to update
      const getResponse = await request("GET", "/api/admin/menu", {
        cookies: session.cookies,
      });
      const itemToUpdate = getResponse.data[0];

      if (!itemToUpdate) throw new Error("No items to update");

      const response = await request("PUT", `/api/admin/menu/${itemToUpdate.id}`, {
        body: {
          name: "Updated Name",
          price: 9999,
        },
        cookies: session.cookies,
      });

      if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
      if (response.data.name !== "Updated Name") throw new Error("Name not updated");
      if (response.data.price !== 9999) throw new Error("Price not updated");
    });

    // Test 6: Toggle item available status
    suite.test("Toggle available → status flips", async () => {
      const getResponse = await request("GET", "/api/admin/menu", {
        cookies: session.cookies,
      });
      const item = getResponse.data[0];
      const initialStatus = item.available;

      const response = await request("PATCH", `/api/admin/menu/${item.id}/toggle`, {
        body: { field: "available" },
        cookies: session.cookies,
      });

      if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);
      if (response.data.available === initialStatus) throw new Error("Status did not toggle");
    });

    // Test 7: Delete menu item
    suite.test("Delete menu item → removed from database", async () => {
      const getResponse = await request("GET", "/api/admin/menu", {
        cookies: session.cookies,
      });
      const itemToDelete = getResponse.data[0];

      const response = await request("DELETE", `/api/admin/menu/${itemToDelete.id}`, {
        cookies: session.cookies,
      });

      if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`);

      // Verify it's deleted
      const checkResponse = await request("GET", `/api/admin/menu/${itemToDelete.id}`, {
        cookies: session.cookies,
      });

      if (checkResponse.status !== 404) throw new Error("Item still exists after delete");
    });

    // Run all tests
    const success = await suite.run();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error(`\n${"✗".padEnd(3)}Fatal error: ${error.message}`);
    process.exit(1);
  }
}

runTests();
