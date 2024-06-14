# GoDentist Smart Dashboard

This repository contains the Next.js project for the GoDentist Smart Dashboard, an internal tool designed to manage and validate doctor partner accounts, monitor operational data, and facilitate decision-making processes.

## Features

- **Account Registration and Login:** Streamlined, secure registration and login process for master accounts.
- **Account/Document Validation:** Display and validation of doctor partner accounts and documents.
- **View All Doctor Partners:** Overview of all verified doctor partner accounts.
- **Patient Count per Doctor/Clinic:** Displays the number of patients handled by each doctor or clinic.
- **Total Transactions:** Helps internal teams validate transactions and prevent fraud.
- **Feedback Overview:** Collects and displays feedback from partners to drive service improvements.
- **Popular Services:** Shows popular services across partner clinics.
- **OCR for Document Extraction:** Extracts important information from uploaded documents.
- **Doctor Partner Notifications:** Alerts for new partner registrations.

## Technologies

This project is built using the following key technologies:

- **[Next.js](https://nextjs.org/)**: A powerful React framework that enables server-side rendering and generating static websites for React-based web applications.
- **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for rapid UI development. It allows us to build custom designs in the HTML.
- **[Next ShadcnUI](https://ui.shadcn.com/docs/installation/next)**: A comprehensive UI framework designed specifically for Next.js applications, enhancing the development of rich, interactive user interfaces.
- **[Next PWA](https://ducanh-next-pwa.vercel.app/docs/next-pwa/getting-started)**: A plugin for Next.js that adds Progressive Web App (PWA) capabilities, enabling offline support and app-like experiences.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v12 or newer)
- npm (v6 or newer)
- Git

## Installation

To get started with the GoDentist Smart Dashboard, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-github-account/godentist-smart-dashboard.git
    cd godentist-smart-dashboard
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env.local` file in the root directory of your project and add the following line:

    ```
    NEXT_PUBLIC_API_BASE_URL=your_backend_url
    ```

    Replace `your_backend_url` with the actual backend URL you are using.

## Running the Application

To run the application on your local machine:

```bash
npm run dev
