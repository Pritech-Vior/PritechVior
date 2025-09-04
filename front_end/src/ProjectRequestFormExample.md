# Project Request API Form Example

This document provides a sample HTML form and JSON payload for submitting a new project request to the API endpoint `/api/projects/requests/`.

---

## API Endpoint

- **URL:** `/api/projects/requests/`
- **Methods Allowed:** GET, POST
- **Content-Type:** application/json

---

## Example JSON Payload

```json
{
  "title": "",
  "description": "",
  "requirements": "",
  "request_type": "new", // or "custom"
  "user_type": "student", // or "client", "business"
  "academic_level": "",
  "institution": "",
  "customizations": null,
  "technology_notes": "",
  "features_required": null,
  "additional_features": [],
  "budget_range": "",
  "preferred_deadline": "", // mm/dd/yyyy
  "timeline_flexibility": "flexible",
  "contact_phone": "",
  "contact_email": "",
  "status": "pending_review",
  "estimated_cost": "",
  "quoted_price": "",
  "estimated_duration": "",
  "estimated_duration_days": "",
  "client_notes": ""
}
```

---

## Example HTML Form

<form>
  <label>Title<br><input type="text" name="title" /></label><br>
  <label>Description<br><textarea name="description"></textarea></label><br>
  <label>Requirements<br><textarea name="requirements"></textarea></label><br>
  <label>Request type<br>
    <select name="request_type">
      <option value="new">New</option>
      <option value="custom">Custom Project</option>
    </select>
  </label><br>
  <label>User type<br>
    <select name="user_type">
      <option value="student">Student</option>
      <option value="client">Client</option>
      <option value="business">Business</option>
    </select>
  </label><br>
  <label>Academic level<br><input type="text" name="academic_level" /></label><br>
  <label>Institution<br><input type="text" name="institution" /></label><br>
  <label>Customizations<br><input type="text" name="customizations" /></label><br>
  <label>Technology notes<br><input type="text" name="technology_notes" /></label><br>
  <label>Features required<br><input type="text" name="features_required" /></label><br>
  <label>Additional features<br><input type="text" name="additional_features" /></label><br>
  <label>Budget range<br><input type="text" name="budget_range" /></label><br>
  <label>Preferred deadline<br><input type="date" name="preferred_deadline" /></label><br>
  <label>Timeline flexibility<br>
    <select name="timeline_flexibility">
      <option value="flexible">Flexible</option>
      <option value="strict">Strict</option>
    </select>
  </label><br>
  <label>Contact phone<br><input type="tel" name="contact_phone" /></label><br>
  <label>Contact email<br><input type="email" name="contact_email" /></label><br>
  <label>Status<br><input type="text" name="status" value="Pending Review" readonly /></label><br>
  <label>Estimated cost<br><input type="text" name="estimated_cost" /></label><br>
  <label>Quoted price<br><input type="text" name="quoted_price" /></label><br>
  <label>Estimated duration<br><input type="text" name="estimated_duration" /></label><br>
  <label>Estimated duration in days<br><input type="number" name="estimated_duration_days" /></label><br>
  <label>Client notes<br><textarea name="client_notes"></textarea></label><br>
</form>

---

## Notes

- All fields should be mapped to the backend API as shown in the JSON payload.
- Fields like `customizations`, `features_required`, and `additional_features` can be left blank or null if not applicable.
- `status` defaults to "Pending Review" on creation.
- Dates should be in `mm/dd/yyyy` format.
- Array fields (e.g., `additional_features`) should be sent as arrays, even if empty.
