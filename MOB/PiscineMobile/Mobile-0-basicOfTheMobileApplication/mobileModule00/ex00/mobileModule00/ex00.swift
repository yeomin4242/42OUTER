import SwiftUI

struct JustButton: View {
    var body: some View {
        VStack {
            Image(systemName: "globe")
                .imageScale(.large)
                .foregroundStyle(.tint)
            Text("Hello World!")
            Button("Click me") {
                print("Button pressed")
            }
        }
        .padding()
    }
}

#Preview {
    JustButton()
}
