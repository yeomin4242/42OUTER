//
//  ContentView.swift
//  ex01
//
//  Created by 민영재 on 3/8/24.
//

import SwiftUI

struct ContentView: View {
    @State var count = 0;
    var body: some View {
        VStack {
            Image(systemName: "globe")
                .imageScale(.large)
                .foregroundStyle(.tint)
            
                Text(self.count % 2 == 0 ? "Hello World!" : "hello world!")
            
            Button("Click me") {
                print("Button pressed")
                self.count += 1
            }
        }
        .padding()
    }
}

#Preview {
    ContentView()
}
