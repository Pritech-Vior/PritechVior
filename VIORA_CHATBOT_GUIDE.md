# Viora Chatbot Integration Guide

## Overview
Viora is PritechVior's professional AI-powered customer support chatbot. It's designed to help visitors with inquiries about services, products, and general support.

## Integration Options

### Option 1: React Component (Recommended for React Apps)
```jsx
import Chatbot from './components/Chatbot';

function App() {
  return (
    <div className="App">
      {/* Your app content */}
      <Chatbot />
    </div>
  );
}
```

### Option 2: Standalone HTML Embed
Perfect for non-React websites or testing:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Website</title>
</head>
<body>
    <!-- Your website content -->
    
    <!-- Include the chatbot HTML file -->
    <iframe src="viora-chatbot-embed.html" 
            style="position: fixed; bottom: 20px; right: 20px; 
                   width: 400px; height: 600px; border: none; 
                   border-radius: 16px; z-index: 999999;">
    </iframe>
</body>
</html>
```

### Option 3: JavaScript Embed Script
For dynamic integration with any website:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Website</title>
</head>
<body>
    <!-- Your website content -->
    
    <!-- Add this script tag before closing body -->
    <script src="viora-chatbot.js"></script>
    
    <!-- Optional: Programmatic control -->
    <script>
        // Open chatbot programmatically
        // VioraChatbot.open();
        
        // Send a message programmatically
        // VioraChatbot.sendMessage("Hello!");
    </script>
</body>
</html>
```

## Customization

### Configuration Options (for JS embed)
```javascript
const config = {
    apiEndpoint: 'https://your-api.com/chat', // Your backend API
    botName: 'Viora',
    companyName: 'PritechVior',
    primaryColor: '#AC6AFF',
    secondaryColor: '#FFC876',
    position: 'bottom-right', // or 'bottom-left'
    autoOpen: false, // Auto-open on page load
    showNotification: true // Show notification badge
};
```

### Styling Customization
The chatbot uses CSS custom properties that can be overridden:

```css
:root {
    --viora-primary: #AC6AFF;
    --viora-secondary: #FFC876;
    --viora-background: #15131D;
    --viora-surface: #252134;
    --viora-text: #FFFFFF;
}
```

## Backend Integration

### API Endpoint Structure
The chatbot expects a POST endpoint that accepts:

```json
{
  "message": "User's message text",
  "session_id": "unique_session_identifier"
}
```

Response format:
```json
{
  "text": "Bot response text",
  "options": ["Option 1", "Option 2", "Option 3"] // Optional quick replies
}
```

### Django Backend Example
```python
# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def chatbot_api(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        message = data.get('message', '')
        session_id = data.get('session_id', '')
        
        # Process message and generate response
        response_text = generate_response(message, session_id)
        
        return JsonResponse({
            'text': response_text,
            'options': get_quick_replies(message)
        })
```

## Features

### Current Capabilities
- ✅ Professional UI with Lucide icons
- ✅ Responsive design (mobile-friendly)
- ✅ Typing indicators
- ✅ Quick reply buttons
- ✅ Local storage for session persistence
- ✅ Predefined responses for common queries
- ✅ Support for both React and vanilla JS

### Predefined Response Categories
1. **Services & Solutions** - IT consulting, project development
2. **Shop & Products** - E-commerce platform, product inquiries
3. **Student Projects** - E-learning platform, project submissions
4. **General Inquiry** - Contact information, company details

## Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance
- Lightweight: ~15KB minified
- No external dependencies (except Lucide icons for React version)
- Lazy loading of chat history
- Optimized for mobile devices

## Testing

### Local Testing
1. Serve the HTML file locally:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

2. Open `http://localhost:8000/viora-chatbot-embed.html`

### Integration Testing
1. Add the embed script to your test page
2. Verify the chatbot appears in the correct position
3. Test message sending and receiving
4. Check mobile responsiveness

## Deployment

### Static Files
Upload these files to your web server:
- `viora-chatbot.js` - Main embed script
- `viora-chatbot-embed.html` - Standalone version

### CDN Deployment (Recommended)
Host the files on a CDN for better performance:
```html
<script src="https://cdn.your-domain.com/viora-chatbot.js"></script>
```

## Troubleshooting

### Common Issues
1. **Chatbot not appearing**: Check console for JavaScript errors
2. **Styling conflicts**: Ensure CSS specificity doesn't override chatbot styles
3. **API errors**: Verify backend endpoint and CORS settings
4. **Mobile display issues**: Test viewport meta tag and responsive CSS

### Debug Mode
Add `?debug=true` to enable console logging:
```javascript
// Enable debug logging
localStorage.setItem('viora_debug', 'true');
```

## Support
For technical support or customization requests:
- Email: info@pritechvior.co.tz
- GitHub: [Your Repository]
- Documentation: [Your Docs URL]

---

**Note**: This chatbot is designed to represent PritechVior's brand and services. Customize the responses and styling to match your specific needs.
