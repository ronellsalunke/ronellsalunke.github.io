---
layout: post

title: "Building Native Experiences In Flutter"

date: 2026-04-12

categories: [flutter, programming, android]
---

Adding Android-specific features like Material You Dynamic Theming, Share Intents, App Shortcuts and Monochrome App Icons to a Flutter app

## Flutter is great, but...

While working on the Bill Splitter Flutter client, I would often find myself thinking about what features could be added to improve the overall user experience. Other times, I would try to 'optimize' the app by reworking some features or even building some features and scrapping it entirely because it just didn't feel right. Something a LOT of Flutter apps struggle with is making the app feel 'native'. The most infamous example of this was the 2-finger scroll gesture scrolling through content twice as fast on Android. While that has since been fixed and performance issues are mostly resolved I was struggling to think of features that would elevate my app from the crowd. A friend asked me if it were possible to have Bill Splitter show up as a target on the Android system share menu and that's when it suddenly clicked: Most Flutter apps don't feel 'native' because they don't fully take advantage of a lot of native user facing features that platforms like Android (or even iOS for that matter) provide. When was the last time you saw a Flutter app that showed up as a target in your share menu? Or one with an App Shortcut for which the API was added all the way back in Android 7? Or one with a Monochrome icon? If you could think of one that isn't Google Pay,arguably the showcase project for Flutter as a framework, (or some random small indie project) then color me impressed because that's the only one I could document at the top of my head.

## What this blog covers

- Overview of the app before adding Android specific features
- Common Android specific features for UX wins - Material You, Share Targets, Monochrome Icons, App Shortcuts
- Challenges building these features
- Why most Flutter apps skip on building platform specific features
- What needs to change

## Material Eww, or was it?

Like a LOT of other app developers, I too was initally turned off by the entire premise of Material 3. Gone were the shadows that beautifully conveyed a sense of elevation and so too was the paper-like feel to the overall aesthetic. What do you mean my app looks just like every other app installed on my phone? There used to be a time when apps oozed personality (and some of them still do!) but now it feels as though every app is just an ocean of muted pastels and overly circular corners. However, I have come to be a _little_ less critical of the designs since the initial announcement and Material 3 Expressive brings back a lot of the charm that was simply absent before.

The Flutter team took their time polishing the Material 3 library and they did a pretty bang up job on getting the details right. Unfortunately, the dynamic color theming was part of a separete `dynamic_color` package which isn't updated frequently. It also has a rather annoying issue with surface colors which makes elevated surfaces like cards blend in completely with the background. This meant one thing: I would need to rethink the dynamic color implementation in Bill Splitter. The solution I was most satisfied with was having a fixed neutal background color for the light and dark themes which would work well across all color schemes and letting the interactable elements like the cards and buttons pop.

Adding dynamic theming support was very straightforward, you just have to wrap your `MaterialApp` with `DynamicColorBuilder` and let your state manangement library of choice handle when and how to enable it.

##

Hot off the trails of dynamic color theming, another hotly contested feature was the inclusion of monochrome app icons which also landed in the same Android release cycle. The concept was the same, more user facing personalization brought on by erasure of brand identity. However, unlike dynamic theming this saw wider and faster adoption from native and cross-platform developers alike and I would again make the argument of simplicty here. Google had already paved the way of having adaptive homescreen icon shapes with the Android 8 release and 4 years later a lot of big and smaller developers had caught up. App developers simply had to create a new variant for the app icon, `ic_launcher_monochrome.xml` and add a single line to `ic_launcher.xml`. In fact it has currently gotten so simple that there are numerous icon generator sites like [Icon Kitchen](https://icon.kitchen/) that will do all the heavy lifting for you. Flutter even has an package called `flutter_launcher_icons` which makes the entire icons process as painless as possible and adding a monochrome icon was again as simple as declaring a single line in the `pubspec.yaml`.

## Snap, this goes into my bill collection

When I first got the request to add in the share intent feature, I was a little nervous because I hadn't built something similar yet and I was a little nervous that I would maybe need to whip out some Java or Kotlin to add the feature but fortunately, there was a package. Flutter's large and extensive package ecosystem has been both it's biggest positive while also being the biggest negative. Sure there's a package for probably anything you can think of but also a lot of unmaintained or low quality packages that also draw high numbers furthering the illusion of "It just works bro". Was there a package on pub.dev to get the desired feature? Yes, `receive_sharing_intent`. Did it work? Nope. Why? JVM-target compatibility. Fortunately, the package's repo on GitHub included a fix and I was able to get it working. Creating the feature was a bit tricky because of what having the feature implied: the user is viewing a photo and taps the share button, Bill Splitter shows up as a target and tapping on the icon should:

    1. Open Bill Splitter
    2. Navigate to the Edit Bills screen
    3. Automatically upload the the shared image to the OCR service

Including this feature definitely was a net positive because it also helped me rethink the OCR flow. Hitting the OCR API was tightly coupled to the the image upload button when it didn't really need to and now a refactor was not only due, but necessary. The friend who requested the feature was happy and alls well that ends well... or so I thought.

The very next release had a bug where the feature broke. Not because something went wrong with the package but because of a big mis-step on my part. I had accidentally included a race condition when I added Sentry for error logging and monitoring which resulted in app launches from the share menu simply opening up the app to the home screen. The fix was pretty simple: just add a few guard checks and we were back to splitting bills.

## Oh no, more guard checks

App Shortcuts are the most recent Android feature I added to Bill Splitter and I'd argue the one that caused me the most grief. Once again, there was a package through which I could build the feature, in this case it was `quick_actions`. However, getting this to work consistently involved more even more guard checks and while the code looks rather ugly, I have gotten it to a point where it works reliably. The key takeaway here was that I had to explictly mark the drawable icon for the App Shortcut as kept or R8 would eliminate it due to only being referened by Flutter side code.

## Why don't more apps do this

Time. Occam's razor suggests that most teams use Flutter as a time (and by extension cost) saving measure. Maintain a common codebase for Android and iOS and suddenly you don't need two teams with different challenges. You don't need to keep up with Android's constant deprecations and XCode being a bad IDE. Most core packages are maintained well enough and **most** apps are just displaying forms and lists which is very feasible with Flutter. However a lot of organsations view the efficiency gains as a means to ship faster and move on to the next feature/project leaving Flutter apps in an unpolished or even unfinished state. An interesting fact: all of our apps at work don't even ship a dark mode (which is a standard feature since Android 10 and iOS 13) in the interest of saving time. Time spent working on quality of life features like these would be better allocated towards building a new feature or working on an entirely new project and this perpetuates the cycle of Flutter apps being quick to set up and get deployed but viewed by a lot of folks as being of lower quality when compared to their native counterparts.

The only reason I was able to build all of these features into Bill Splitter is because I have a vested interest in making this app as good as possible. I actively set time aside to work on polish. I wanted it to be treated like a first class citizen, at least on Android, because I care about building quality experiences. I also happen to use my app and wanted to see it be better. A lot developers often aren't end users of their own software which results in oversight in terms of user experience.

## Where do we go from here

As much as I would like to see the situation improve, I will have to go with the more realistic option - the precedent is already set and it cannot easily be changed. Flutter will continue to see adoption but the quality of user experiences will not drastically improve. And to the "generative AI will make it easier to get all of these features added" crowd, I hear you but my point still stands. People were using Flutter to bring efficiency gains, add in GenAI which has resulted in shaving weeks if not months off projects, and suddenly management is event happier and will only expect faster shipping velocity as LLMs advance which puts us back in the viscious cycle of 'Flutter apps aren't all that'. However, there is a light at the end of the tunnel. There still are some organizations who care about building quality native and cross-platform experiences because to them long term customer satisfaction is worth more than moving on to the next project. You can also make the ones who don't care by causing some chatter, a lot of product-based organisations take reviews and feedback seriously as it affects their discoverability and by extension revenue. If you are a fellow Flutter app developer, you too can be a part of the solution. Advocate for building apps with more polish and try to improve the experience for the platforms you build for.
