mkdir -p Projects/Core/Authentication/Resources
if [ -f Configs/GoogleService-Info.plist ]; then
    cp Configs/GoogleService-Info.plist Projects/App/Resources
    cp Configs/GoogleService-Info.plist Projects/Core/Authentication/Resources
fi