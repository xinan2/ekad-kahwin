# Viewport Testing Guide for iPhone Safari Compatibility

## Issues Fixed
1. **Fixed viewport height** - Now uses 100vh/100% height instead of min-height
2. **Prevented scrolling** - Body has overflow hidden with overscroll-behavior: none
3. **Bottom navigation bar** - Always stays at the bottom using flexbox layout
4. **Content scaling** - Uses rem and vw units for responsive sizing
5. **Safe areas** - Properly handles iOS safe areas for notched devices

## CSS Changes Made

### Global Styles (globals.css)
- Set `html` and `body` to 100% height
- Removed fixed positioning on html (was causing bottom nav to be cut off)
- Added `overscroll-behavior: none` to prevent elastic scrolling
- Added safe area inset classes for iOS devices
- Disabled text size adjustment on orientation change

### Layout Changes
- Added viewport meta configuration with viewport-fit="cover"
- Set maximum scale to 1 to prevent zooming
- Applied height classes to html and body elements

### Component Structure
- Main container uses flexbox layout with `flex-col`
- Content area has `flex-1` and `overflow-y-auto` for scrollable sections
- Bottom navigation is outside the scrollable area
- Used gradient background on nav container for better visibility
- Applied safe-area-inset-bottom to the navigation container

## Testing Steps

### iPhone 13 Pro and Above (Safari)
1. Open the app in Safari
2. Check that the bottom navigation bar is always visible
3. Verify no page scrolling occurs (only content area scrolls)
4. Test landscape orientation - content should resize
5. Test the bottom sheet modal - should not exceed 75vh
6. Verify bottom nav doesn't get cut off by home indicator

### Android Chrome
1. Open the app in Chrome
2. Verify bottom navigation is visible
3. Check that page doesn't scroll
4. Test responsive behavior

### Device-Specific Tests
- **iPhone 13 Pro**: 390 x 844 pixels
- **iPhone 14 Pro**: 393 x 852 pixels  
- **iPhone 15 Pro**: 393 x 852 pixels
- **iPhone 14/15 Pro Max**: 430 x 932 pixels

### Key Areas to Verify
1. Language selector button stays in safe area
2. Bottom navigation is always visible and doesn't overlap with home indicator
3. Content between header and navigation is scrollable if needed
4. Modal sheets respect safe areas
5. No horizontal or vertical page scrolling occurs
6. Bottom navigation has proper padding for safe areas

## Debugging Tips
If issues persist:
1. Check Safari Developer Tools for viewport size
2. Use `window.visualViewport` to debug viewport dimensions
3. Test with Safari's responsive design mode
4. Clear Safari cache and reload
5. Check if safe-area-inset-bottom is being applied

## Additional Considerations
- The app uses flexbox layout for proper content distribution
- Safe area insets are applied to navigation container
- Touch events have webkit-tap-highlight-color disabled
- Background gradient added to bottom navigation area for better visibility 