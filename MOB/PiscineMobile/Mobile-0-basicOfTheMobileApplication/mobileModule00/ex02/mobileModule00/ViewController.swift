import UIKit
import Expression

class ViewController: UIViewController {
    var buttonContainerStackView = UIStackView()
    var ACbutton: UIButton!
    var lblResult: UILabel!
    var displayTextField: UITextField!
    var resultTextField: UITextField! // Read-only text field for displaying results
    var button : UIButton!
    
    var currentTotal: Double?
    var currentOperator: String?
    
    var currentNum:Double = 0.0
    var firstOperand:Double = 0.0
    var result:Double = 0.0
    
    override func viewDidLoad() {
        super.viewDidLoad()
        displayTextField?.text = "0"
        setHeaderView()
        setButtons()
        setTextField()
        
        view.backgroundColor = .white // View의 배경색을 지정합니다.
    }
    
    func setHeaderView() {
        let headerView = UIView()
        headerView.backgroundColor = .systemTeal // Header view의 배경색을 지정합니다.
        headerView.translatesAutoresizingMaskIntoConstraints = false // Auto Layout을 사용하기 위해 false로 설정합니다.
        view.addSubview(headerView) // View에 headerView를 추가합니다.
        
        let label = UILabel()
        label.text = "Calculator" // 라벨 텍스트를 설정합니다.
        label.textColor = .white // 라벨의 텍스트 색상을 설정합니다.
        label.font = UIFont.systemFont(ofSize: 24, weight: .bold) // 라벨의 폰트를 설정합니다.
        label.textAlignment = .center // 라벨의 정렬을 가운데로 설정합니다.
        label.translatesAutoresizingMaskIntoConstraints = false // Auto Layout을 사용하기 위해 false로 설정합니다.
        headerView.addSubview(label) // Header view에 라벨을 추가합니다.
        
        // Auto Layout 제약 조건 설정
        NSLayoutConstraint.activate([
            // headerView 제약 조건 설정
            headerView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor), // 상단에 붙입니다.
            headerView.leadingAnchor.constraint(equalTo: view.leadingAnchor), // 왼쪽에 붙입니다.
            headerView.trailingAnchor.constraint(equalTo: view.trailingAnchor), // 오른쪽에 붙입니다.
            headerView.heightAnchor.constraint(equalToConstant: 70), // 높이를 70으로 고정합니다.
            
            // label 제약 조건 설정
            label.topAnchor.constraint(equalTo: headerView.topAnchor, constant: 20), // 상단 여백 20을 줍니다.
            label.leadingAnchor.constraint(equalTo: headerView.leadingAnchor, constant: 20), // 왼쪽 여백 20을 줍니다.
            label.trailingAnchor.constraint(equalTo: headerView.trailingAnchor, constant: -20), // 오른쪽 여백 20을 줍니다.
            label.bottomAnchor.constraint(equalTo: headerView.bottomAnchor, constant: -20) // 하단 여백 20을 줍니다.
        ])
    }

    
    func setTextField() {
        // Configure displayView
        let displayView = UIView()
        displayView.backgroundColor = .clear
        displayView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(displayView)
        
        // Configure displayTextField
        displayTextField = UITextField()
        displayTextField.text = "0"
        displayTextField.placeholder = "Enter expression"
        displayTextField.textAlignment = .right
        displayTextField.font = UIFont.systemFont(ofSize: 30)
        displayTextField.translatesAutoresizingMaskIntoConstraints = false
        displayTextField.autocorrectionType = .no
        displayTextField.spellCheckingType = .no
        displayView.addSubview(displayTextField)
        
        // Configure resultView
        let resultView = UIView()
        resultView.backgroundColor = .clear
        resultView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(resultView)
        
        // Configure resultTextField
        resultTextField = UITextField()
        resultTextField.text = "0"
        resultTextField.placeholder = "Result"
        resultTextField.textAlignment = .right
        resultTextField.font = UIFont.systemFont(ofSize: 30)
        resultTextField.isUserInteractionEnabled = false
        resultTextField.translatesAutoresizingMaskIntoConstraints = false
        resultView.addSubview(resultTextField)
        
        // Auto Layout constraints for resultView
        NSLayoutConstraint.activate([
            resultView.bottomAnchor.constraint(equalTo: buttonContainerStackView.topAnchor, constant: -20), // 버튼 컨테이너 위에 위치하도록 조정
            resultView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 50),
            resultView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -50),
//            resultView.heightAnchor.constraint(equalToConstant: UIScreen.main.bounds.size.width / 4)
        ])
        
        // Auto Layout constraints for resultTextField
        NSLayoutConstraint.activate([
            resultTextField.topAnchor.constraint(equalTo: resultView.topAnchor),
            resultTextField.leadingAnchor.constraint(equalTo: resultView.leadingAnchor),
            resultTextField.trailingAnchor.constraint(equalTo: resultView.trailingAnchor),
            resultTextField.bottomAnchor.constraint(equalTo: resultView.bottomAnchor)
        ])
        
        // Auto Layout constraints for displayView
        NSLayoutConstraint.activate([
            displayView.bottomAnchor.constraint(equalTo: resultView.topAnchor, constant: -20), // resultView 바로 위에 위치하도록 조정
            displayView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 50),
            displayView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -50),
//            displayView.heightAnchor.constraint(equalToConstant: UIScreen.main.bounds.size.width / 3)
        ])
        
        // Auto Layout constraints for displayTextField
        NSLayoutConstraint.activate([
            displayTextField.topAnchor.constraint(equalTo: displayView.topAnchor),
            displayTextField.leadingAnchor.constraint(equalTo: displayView.leadingAnchor),
            displayTextField.trailingAnchor.constraint(equalTo: displayView.trailingAnchor),
            displayTextField.bottomAnchor.constraint(equalTo: displayView.bottomAnchor)
        ])
    }



    func setButtons() {
        let buttons: [[String]] = [
            ["7", "8", "9", "/", "AC"],
            ["4", "5", "6", "*", "C"],
            ["1", "2", "3", "-", ""],
            ["0", ".", "=", "+", ""]
        ]
        

        buttonContainerStackView.axis = .vertical
        buttonContainerStackView.distribution = .fillEqually
        buttonContainerStackView.spacing = 10 // 수직 간격
        buttonContainerStackView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(buttonContainerStackView)
        
        NSLayoutConstraint.activate([
            buttonContainerStackView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            buttonContainerStackView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            buttonContainerStackView.bottomAnchor.constraint(equalTo: view.bottomAnchor, constant: -10),
            buttonContainerStackView.heightAnchor.constraint(equalTo: view.heightAnchor, multiplier: 0.5) // 전체 높이의 반을 차지하도록 설정
        ])
        
        for row in buttons {
            let buttonRowStackView = UIStackView()
            buttonRowStackView.axis = .horizontal
            buttonRowStackView.distribution = .fillEqually
            buttonRowStackView.spacing = 10 // 가로 간격
            
            for title in row {
                let button = UIButton(type: .system)
                button.setTitle(title, for: .normal)
                button.titleLabel?.font = UIFont.systemFont(ofSize: 24)
                button.addTarget(self, action: #selector(calculatorButtonTapped(_:)), for: .touchUpInside)
                buttonRowStackView.addArrangedSubview(button)
            }
            
            buttonContainerStackView.addArrangedSubview(buttonRowStackView)
        }
    }
    
    @IBAction func calculatorButtonTapped(_ sender: UIButton) {
        guard let title = sender.currentTitle else { return }
        
//        if displayTextField?.text == "Error" && title != "AC" {
//            return
//        }
//        
//        switch title {
//        case "=":
//            if String(format: "%.1f", result) == "Error" {
//                displayTextField?.text = "Error"
//                resultTextField?.text = "Error"
//            }
//            else if let expressionText = displayTextField?.text {
//                do {
//                    let expression = Expression(expressionText)
//                    let result = try expression.evaluate()
//                    if String(format: "%.1f", result) == "inf" {
//                        displayTextField?.text = "Error"
//                        resultTextField?.text = "Error"
//                    }
//                    else
//                    {
//                        displayTextField?.text = "\(result)"
//                        resultTextField?.text = "\(result)"
//                    }
//                } catch {
//                    displayTextField?.text = "Error"
//                    resultTextField?.text = "Error"
//                }
//            }
//        case "AC":
//            displayTextField?.text = "0"
//            resultTextField?.text = "0"
//        case "C":
//            if let text = displayTextField?.text, !text.isEmpty {
//                displayTextField?.text = String(text.dropLast())
//                if displayTextField?.text?.isEmpty ?? true {
//                    displayTextField?.text = "0"
//                }
//            }
//        default:
//            if let text = displayTextField?.text {
//                if text == "0" && title != "." {
//                    displayTextField?.text = title
//                } else {
//                    displayTextField?.text = text + title
//                }
//            }
//        }
        
        if let pressedButtonTitle = sender.currentTitle, !pressedButtonTitle.isEmpty {
            print("Button pressed:", pressedButtonTitle)
        }
    }
}
