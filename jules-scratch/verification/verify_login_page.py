from playwright.sync_api import sync_playwright, Page, expect

def verify_login_page(page: Page):
    """
    This test verifies that the login page is rendered correctly.
    """
    # 1. Arrange: Go to the login page.
    page.goto("http://localhost:5173/login")

    # 2. Assert: Confirm the page has the correct title and elements.
    expect(page).to_have_title("Vite + React + TS") # Default title from vite

    # Check for the "Login" heading
    heading = page.get_by_role("heading", name="Login")
    expect(heading).to_be_visible()

    # Check for the email and password fields
    email_input = page.get_by_label("Email")
    password_input = page.get_by_label("Password")
    expect(email_input).to_be_visible()
    expect(password_input).to_be_visible()

    # Check for the login button
    login_button = page.get_by_role("button", name="Login")
    expect(login_button).to_be_visible()

    # 3. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/verification.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify_login_page(page)
        browser.close()

if __name__ == "__main__":
    main()
