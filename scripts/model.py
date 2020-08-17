import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix
from sklearn.metrics import accuracy_score
from sklearn.tree import DecisionTreeClassifier

if __name__ == "__main__":
    dataset = pd.read_csv('./scripts/colors.csv')
    # red, blue, green values for X independent variable
    X = dataset.iloc[:, :-1]

    # the text will be output and will be the Y independent variable.
    Y = dataset.iloc[:, -1]

    # splitting the training data and the testing data.
    X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size = 0.2, random_state = 1)

    # LOGISTIC REGRESSION MODEL
    regression_model = LogisticRegression()

    # training the model
    regression_model.fit(X_train, Y_train)

    # predicting with the splitted dataset
    prediction = regression_model.predict(X_test)

    # generating report
    report = classification_report(Y_test, prediction)

    # making the confusion matrix
    matrix = confusion_matrix(Y_test, prediction)

    pickle.dump(regression_model, open('./scripts/model.pkl', 'wb'))

    # checking the accuracy
    accuracy = accuracy_score(Y_test, prediction)
    print(accuracy)

    # # DECISION TREE MODEL
    # decisionTreeModel = DecisionTreeClassifier()
    # decisionTreeModel.fit(X_train, Y_train)
    # prediction = decisionTreeModel.predict(X_test)
    # accuracy = accuracy_score(Y_test, prediction)