## spring have 3 main parameters
-stiffness : stiffness of the spring, higher value means stiffer spring
-damping : damping ratio of the spring, higher value means more damping
-mass : mass of the object attached to the spring, higher value means more inertia

    Great animations are fast

    Never animate keyboard initiated actions:
        These actions are repeated sometimes hundreds of times a day, an animation would make them feel slow and disconnected from user’s actions.

The rule of thumb here is that you should try to animate with transform and opacity as they only trigger the third rendering step (composite),while padding or margin triggers all three (layout, paint, composite)

A hardware-accelerated animation will remain smooth, no matter how busy the main thread is. Keep in mind that even if you do animate with CSS, not all properties are hardware-accelerated, but if you stick to transform and opacity, you should be fine.

-------------------
web interface guidelines
Interactivity: 
    input:
        * clicking the input should focus it
        * should be wrapped with a form to submit by pressing enter
        * should have an appropriate type
        * should disable spellcheck and autocomplete
        * should use required when appropriate
        * input prefix and suffix should absolutly positioned on top of the text input with padding, not next to it, and trigger focus on the input

    Buttons: 
        * should be disabled immediately after submition of the form
        * inter active elemets should disable user-select for inner content
        * Decorative elements (glows, gradients) should disable pointer-events to not hijack events

    Fonts: 
        * use -webkit-font-smoothing: antialiased and -moz-osx-font-smoothing: grayscale;
        * don't use font weight less than 400
        * meduim sized headings generally look best with a font weight of 500 or 600
        * body text generally looks best with a font weight of 400
        * adjust values fluidly by using clamp() function, for example: clamp(400, 500, 600) for font size
        * use font-variant-numeric: tabular-nums for numbers 
        * Prevent text resizing unexpectedly in landscape mode on iOS with -webkit-text-size-adjust: 100%

    Motion: 
        * Switching themes should not trigger transitions and animations on elements (temporarily disable transitions or avoid indiscriminate transition: all on colors)
        * Animation duration should not exceed 200ms for interaction feedback to feel instantaneous
        * Animation values should be proportional to trigger size:
            - Don't scale dialogs from 0 → 1 (pops from a dot); fade opacity and scale subtly from ~0.95 → 1
            - Don't scale buttons on press from 1 → 0.8 (feels squishy/laggy); scale subtly to ~0.96 for tactile response
        * Frequent, low-novelty actions should avoid extraneous animations (e.g., right-click context menus, deleting/adding list items, hovering trivial buttons)
        * Looping animations should pause when not visible in viewport (via IntersectionObserver or animation-play-state: paused) to offload CPU and GPU cycles
        * Use scroll-behavior: smooth for in-page anchors with an appropriate offset (scroll-margin-top / scroll-padding-top) so sticky headers never occlude content

    Touch & Mobile:
        * Hover states should not be visible on touch press, use @media (hover: hover) and (pointer: fine) to prevent sticky hover states
        * Font size for inputs should not be smaller than 16px to prevent iOS Safari auto-zooming on focus
        * Inputs should not auto focus on touch devices as it opens the virtual keyboard and covers the screen
        * Apply muted and playsinline to <video /> tags to enable autoplay on iOS Safari
        * Disable touch-action (touch-action: none) for custom components implementing pan and zoom gestures to prevent native scroll interference
        * Disable default iOS tap highlight with -webkit-tap-highlight-color: transparent, but always replace it with an appropriate tactile :active alternative

    Performance & Hardware:
        * Large blur() values for filter and backdrop-filter may be slow on mobile/integrated GPUs
        * Scaling and blurring filled rectangles causes color banding; use radial gradients instead
        * Sparingly enable GPU rendering with transform: translateZ(0) for unperformant animations (avoid layer explosion)
        * Toggle will-change on unperformant scroll animations only for the duration of the animation, then remove it
        * Auto-playing too many videos on iOS will choke hardware decoders; pause or unmount off-screen videos via IntersectionObserver
        * Bypass React's render lifecycle with refs for real-time values (mouse tracking, drag, scroll) to commit directly to DOM styles
        * Detect and adapt to the hardware and network capabilities of the user's device (hardwareConcurrency, deviceMemory, connection.effectiveType)

    Accessibility, Keyboard & Navigation:
        * Disabled buttons should not have tooltips (they are not keyboard-accessible or focusable; use aria-disabled="true" or explain requirements inline)
        * Box shadow should be used for focus rings instead of outline (box-shadow respects exact border-radius without awkward corner gaps)
        * Focusable elements in a sequential list should be navigable with ↑ ↓ arrow keys (roving tabindex pattern)
        * Focusable elements in a sequential list should be deletable with ⌘ Backspace / Delete
        * To open immediately on press, dropdown menus should trigger on mousedown, not click (eliminates release lag)
        * Use an SVG favicon with an internal <style> tag adhering to prefers-color-scheme (auto-adapts to system dark/light mode)
        * Icon-only interactive elements must define an explicit aria-label (prevents screen readers announcing empty buttons)
        * Tooltips triggered by hover should not contain interactive content (use Popovers for clickable content to avoid hover traps)
        * Images should always be rendered with <img> instead of CSS background-image (enables screen readers, alt text, drag, and right-click copying)
        * Illustrations built with HTML should have an explicit role="img" and aria-label instead of announcing raw DOM trees to screen readers
        * Gradient text (-webkit-background-clip: text) must unset the transparent fill on ::selection to keep highlighted text visible
        * When using nested submenus, use a "prediction cone" (safe hover triangle) to prevent moving cursor from closing the submenu prematurely

    Design:
        * Optimistically update data locally and roll back on server error with feedback (instant UI feel with safe rollback)
        * Authentication redirects should happen on the server before the client loads to avoid janky URL changes and auth flashes
        * Style the document selection state with ::selection to match product brand and palette
        * Display feedback relative to its trigger:
            - Show a temporary inline checkmark on a successful copy, not an intrusive notification/toast
            - Highlight the relevant input(s) on form error(s) and display contextual error text directly beneath the field
        * Empty states should prompt to create a new item, with optional quick-start templates