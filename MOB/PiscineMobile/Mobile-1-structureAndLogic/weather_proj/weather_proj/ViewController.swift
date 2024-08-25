import UIKit

class ViewController: UIViewController, UISearchBarDelegate {
    var topBar = UIView()
    var searchTextField = UISearchBar()
    var geolocationButton = UIButton(type: .system)
    var customTabBarController: SwipeableTabBarController?
    var displayText:String?
    var totalText = UILabel() // 화면 중앙에 값을 표시할 UILabel
    
    override func viewDidLoad() {
        super.viewDidLoad()
//    https://jangsh9611.tistory.com/50
        searchTextField.delegate = self
        
        setupTopBar()
        setupTotalText() // displayText 설정
        setupCustomTabBarController()
    }
    
    private func setupTopBar() {
        view.addSubview(topBar)
        topBar.backgroundColor = .lightGray
        topBar.translatesAutoresizingMaskIntoConstraints = false
        
        NSLayoutConstraint.activate([
            topBar.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            topBar.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            topBar.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            topBar.heightAnchor.constraint(equalToConstant: 60)
        ])
        
        // searchTextField 설정
        topBar.addSubview(searchTextField)
        searchTextField.translatesAutoresizingMaskIntoConstraints = false
        searchTextField.placeholder = "Search"
        searchTextField.autocorrectionType = .no
        searchTextField.spellCheckingType = .no
        
        // geolocationButton 설정
        topBar.addSubview(geolocationButton)
        geolocationButton.translatesAutoresizingMaskIntoConstraints = false
        geolocationButton.setTitle("Locate", for: .normal)
        geolocationButton.setImage(UIImage(systemName: "location"), for: .normal)

        geolocationButton.addTarget(self, action: #selector(geolocationButtonTapped), for: .touchUpInside)
        
        NSLayoutConstraint.activate([
            searchTextField.leadingAnchor.constraint(equalTo: topBar.leadingAnchor, constant: 10),
            searchTextField.centerYAnchor.constraint(equalTo: topBar.centerYAnchor),
            searchTextField.trailingAnchor.constraint(equalTo: geolocationButton.leadingAnchor, constant: -10),
            
            geolocationButton.trailingAnchor.constraint(equalTo: topBar.trailingAnchor, constant: -10),
            geolocationButton.centerYAnchor.constraint(equalTo: topBar.centerYAnchor)
        ])
    }

    private func setupTotalText() {
        print("setupTotalText")
        view.addSubview(totalText)
        totalText.translatesAutoresizingMaskIntoConstraints = false
        totalText.textAlignment = .center
        totalText.font = UIFont.systemFont(ofSize: 24)
        
        NSLayoutConstraint.activate([
            totalText.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            totalText.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
        
    }

    func searchBarSearchButtonClicked(_ searchBar: UISearchBar) {
        print("searchBarSearchButtonClicked")
        searchBar.resignFirstResponder() // 키보드 숨김
        if let searchText = searchBar.text {
            totalText.text = searchText // 사용자가 입력한 텍스트로 displayText 업데이트
            // 필요한 경우 여기에서 추가적인 업데이트 로직 구현
        }
        displayText = totalText.text
        updateTabsContent(text: displayText ?? "")
    }
    
    
    private func setupCustomTabBarController() {
        let tabBarController = SwipeableTabBarController()
        self.customTabBarController = tabBarController
        
        let currentlyViewController = makeViewController(withTitle: "Currently")
        let todayViewController = makeViewController(withTitle: "Today")
        let weeklyViewController = makeViewController(withTitle: "Weekly")
        
        tabBarController.viewControllers = [currentlyViewController, todayViewController, weeklyViewController]
        tabBarController.selectedIndex = 0
        
        view.addSubview(tabBarController.view)
        addChild(tabBarController)
        tabBarController.didMove(toParent: self)
        
        tabBarController.view.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            tabBarController.view.topAnchor.constraint(equalTo: topBar.bottomAnchor),
            tabBarController.view.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tabBarController.view.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tabBarController.view.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
    }
    
    @objc func geolocationButtonTapped() {
        // 기존 코드 ...
        displayText = "geolocation"
        
        // displayText가 nil일 경우를 대비하여 기본값 ""(빈 문자열)을 제공합니다.
        updateTabsContent(text: displayText ?? "")
        print("Tapped geolocationButton")
    }
    
    private func updateTabsContent(text: String) {
        guard let viewControllers = customTabBarController?.viewControllers as? [CustomViewController] else { return }
        for viewController in viewControllers {
            viewController.updateContent(text: text)
        }
        print("updateTabs")
    }
    
    private func makeViewController(withTitle title: String) -> UIViewController {
        let viewController = CustomViewController()
        viewController.tabTitle = title

        // 탭 바 아이템 설정
        switch title {
        case "Currently":
            viewController.tabBarItem = UITabBarItem(title: "Currently", image: UIImage(systemName: "sun.max"), tag: 0)
        
        case "Today":
            viewController.tabBarItem = UITabBarItem(title: "Today", image: UIImage(systemName: "calendar"), tag: 1)
            
        case "Weekly":
            viewController.tabBarItem = UITabBarItem(title: "Weekly", image: UIImage(systemName: "calendar.circle"), tag: 2)
            
        default:
            viewController.tabBarItem = UITabBarItem(title: title, image: nil, tag: 0)
        }
        
        // UILabel 설정
        let label = UILabel()
        // displayText가 nil일 경우 title만 표시하고, 아니면 title과 displayText를 함께 표시합니다.
        label.text = "\(title)\n\(displayText ?? "")"
        label.numberOfLines = 0 // 레이블이 여러 줄을 표시할 수 있도록 설정
        label.textAlignment = .center
        label.font = UIFont.systemFont(ofSize: 24)
        label.translatesAutoresizingMaskIntoConstraints = false
        
        viewController.view.addSubview(label)
        
        // 레이블을 화면 중앙에 위치시킵니다.
        NSLayoutConstraint.activate([
            label.centerXAnchor.constraint(equalTo: viewController.view.centerXAnchor),
            label.centerYAnchor.constraint(equalTo: viewController.view.centerYAnchor)
        ])
        
        return viewController
    }
    
    class CustomViewController: UIViewController {
        var tabTitle: String?
        // 텍스트를 표시할 UILabel 선언
        var contentLabel = UILabel()
        var label = UILabel()

        override func viewDidLoad() {
            super.viewDidLoad()
            self.view.backgroundColor = .white // 기본 배경색을 흰색으로 설정

            setupContentLabel() // 레이블 설정을 위한 메소드 호출
        }
        
        func updateContent(with text: String) {
            // 이제 contentLabel은 tabTitle과 text(여기서는 displayText)를 함께 표시합니다.
            if let title = self.tabTitle {
                self.contentLabel.text = "\(title)\n\(text)"
            } else {
                self.contentLabel.text = text
            }
        }

        func setupContentLabel() {
            // 레이블의 기본 설정
            contentLabel.textAlignment = .center
            contentLabel.numberOfLines = 0 // 여러 줄 표시 가능하도록 설정

            // 레이블의 크기 및 위치 설정
            contentLabel.translatesAutoresizingMaskIntoConstraints = false
            view.addSubview(contentLabel)
            NSLayoutConstraint.activate([
                contentLabel.centerYAnchor.constraint(equalTo: view.centerYAnchor),
                contentLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
                contentLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20)
            ])
        }

        func updateContent(text: String) {
            print("Update content with text: \(text)")
            // 레이블에 텍스트 설정
            contentLabel.text = text
        }
    }

    class SwipeableTabBarController: UITabBarController, UIGestureRecognizerDelegate {
        override func viewDidLoad() {
            super.viewDidLoad()
            
            // 왼쪽 스와이프 제스처 추가
            let swipeLeft = UISwipeGestureRecognizer(target: self, action: #selector(handleSwipe(_:)))
            swipeLeft.direction = .left
            self.view.addGestureRecognizer(swipeLeft)
            
            // 오른쪽 스와이프 제스처 추가
            let swipeRight = UISwipeGestureRecognizer(target: self, action: #selector(handleSwipe(_:)))
            swipeRight.direction = .right
            self.view.addGestureRecognizer(swipeRight)
        }
        
        @objc func handleSwipe(_ gesture: UISwipeGestureRecognizer) {
            let selectedIndex = self.selectedIndex
            
            if gesture.direction == .left {
                if selectedIndex < (self.viewControllers?.count ?? 1) - 1 {
                    self.selectedIndex = selectedIndex + 1
                }
            } else if gesture.direction == .right {
                if selectedIndex > 0 {
                    self.selectedIndex = selectedIndex - 1
                }
            }
        }
    }
}


