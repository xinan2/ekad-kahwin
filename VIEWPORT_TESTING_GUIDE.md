# Viewport Testing Guide for iPhone Safari Compatibility

## Issues Fixed
1. **Fixed viewport height** - Now uses 100vh/100% height instead of min-height
2. **Prevented scrolling** - HTML and body are now fixed position with overflow hidden
3. **Bottom navigation bar** - Always stays at the bottom with safe-area-inset-bottom
4. **Content scaling** - Uses rem and vw units for responsive sizing

## CSS Changes Made

### Global Styles (globals.css)
- Set `html` to fixed position with 100% height
- Prevented elastic/bounce scrolling on iOS
- Added safe area classes for iOS devices
- Disabled text size adjustment on orientation change

### Layout Changes
- Added viewport meta configuration
- Set maximum scale to 1 to prevent zooming
- Added viewport-fit="cover" for full screen on notched devices

### Component Changes
- Main container uses `h-screen` instead of `min-h-screen`
- Content area has `overflow-y-auto` for scrollable sections
- Bottom navigation uses `flex-shrink-0` to maintain fixed size
- Used smaller font sizes and spacing for better fit

## Testing Steps

### iPhone 13 Pro and Above (Safari)
1. Open the app in Safari
2. Check that the bottom navigation bar is always visible
3. Verify no scrolling occurs on the main page
4. Test landscape orientation - content should resize
5. Test the bottom sheet modal - should not exceed 75vh

### Device-Specific Tests
- **iPhone 13 Pro**: 390 x 844 pixels
- **iPhone 14 Pro**: 393 x 852 pixels  
- **iPhone 15 Pro**: 393 x 852 pixels
- **iPhone 14/15 Pro Max**: 430 x 932 pixels

### Key Areas to Verify
1. Language selector button stays in safe area
2. Bottom navigation doesn't overlap with home indicator
3. Content between header and navigation is scrollable if needed
4. Modal sheets respect safe areas
5. No horizontal scrolling occurs

## Debugging Tips
If issues persist:
1. Check Safari Developer Tools for viewport size
2. Use `window.visualViewport` to debug viewport dimensions
3. Test with Safari's responsive design mode
4. Clear Safari cache and reload

## Additional Considerations
- The app now uses `dvh` units where supported for dynamic viewport height
- Safe area insets are applied to top and bottom elements
- Touch events have webkit-tap-highlight-color disabled 