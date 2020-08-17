import pickle
import numpy as np
import sys

if __name__ == "__main__":
    data = eval(sys.argv[1])
    model = pickle.load(open('./scripts/model.pkl', 'rb'))
    color = []
    color.append(data['r']/255)
    color.append(data['g']/255)
    color.append(data['b']/255)
    score = [np.array(color)]
    prediction = model.predict(score)
    print(round(prediction[0], 2))
