## GEOFENCING DEBUG GUIDE

### Expected Log Flow When Using TEST CONTROLLER:

1. **Location Update:**
   ```
   📍 Location updated: 10.3157, 123.8854
   ```

2. **Location Effect Triggered:**
   ```
   📊 Location effect triggered: hasLocationChanged=true, lastLocation=none
   ✅ Location changed > 50m, scheduling check...
   ⏰ 10 second timeout fired, calling checkForSpotsInRadius
   ```

3. **Check For Spots (CRITICAL):**
   ```
   🔄 checkForSpotsInRadius called
   🔍 Checking 47 spots within 2000m...
      Spot 0: Cebu Museum - distance: 450m
      Spot 1: Sutukil - distance: 1200m
      Spot 2: Tuslob Buwa - distance: 800m
   📍 Found 3 spots in current radius
      Spots in radius: Cebu Museum, Sutukil, Tuslob Buwa
   🆕 Found 1 NEW spots in radius
   🆕 New spot names: Cebu Museum
   📍 Found 1 NEW spots in radius - SENDING NOTIFICATIONS
   ```

4. **Send Notification:**
   ```
   📤 Scheduling sendSpotNotification for Cebu Museum at index 0
   ⏰ Timeout fired: Calling sendSpotNotification for Cebu Museum
   🚀 sendSpotNotification called for: Cebu Museum
   ✅ Debounce passed for Cebu Museum
   📍 Distance to Cebu Museum: 450m
   📤 Scheduling notification for Cebu Museum...
   ✅ NOTIFICATION SCHEDULED: Cebu Museum
   ```

5. **Receive Notification (should happen automatically after SCHEDULED):**
   ```
   📬 ✅✅✅ NOTIFICATION RECEIVED IN LISTENER ✅✅✅
   📬 Full notification object: {...}
   📬 Notification title: 📍 Cebu Museum Nearby!
   📬 Notification body: You're 450m away (within 2km radius)
   📝 Calling setLastNotification with: 📍 Cebu Museum Nearby!
   ```

### WHAT TO CHECK:

**If you see the TEST button notification working but geofencing doesn't:**

1. Do you see "📍 Location updated" logs? 
   - If NO → Location watcher not working
   - If YES → Continue to step 2

2. Do you see "📊 Location effect triggered"?
   - If NO → userLocation or spots not loaded
   - If YES → Continue to step 3

3. Do you see "🔍 Checking X spots within Xm..." with spot distances?
   - If NO → checkForSpotsInRadius not being called
   - If YES → Continue to step 4

4. Do you see "📍 Found X spots in current radius"?
   - If 0 → Distance calculation wrong OR spots data structure wrong
   - If > 0 → Continue to step 5

5. Do you see "🆕 Found X NEW spots"?
   - If 0 → All spots already marked as notified (notifiedSpotsInRadius issue)
   - If > 0 → Continue to step 6

6. Do you see "📤 Scheduling sendSpotNotification"?
   - If NO → sendSpotNotification not being called
   - If YES → Notification system should handle it

### SHARE THESE LOGS:

When you test, copy the ENTIRE console output from:
- Starting when you tap TEST button (to verify listener works)
- Then tap TEST CONTROLLER arrows to move around
- Show at least 20-30 seconds of logs

This will show exactly which step is failing!
