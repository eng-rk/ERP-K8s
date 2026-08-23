# CRM module

The CRM module is the frontend boundary for all customer-facing sales and relationship-management capabilities.

## Feature boundaries

- `leads`: lead directory, assignment/distribution, lead details
- `campaigns`: campaign management and public campaign form
- `offers`: offer details and offer lifecycle UI
- `sales`: sales kanban and executive sales views
- `bookings`: booking lookup
- `analytics`: CRM analytics
- `tickets`: CRM/support tickets
- `email`: email inbox, sent history, and composer

Shared infrastructure (authentication, layout, generic UI, API client) stays outside the CRM domain.
