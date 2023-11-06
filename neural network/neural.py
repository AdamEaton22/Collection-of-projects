import numpy as np


def function(x):
    # just an example function to see if the neural network can learn to predict if an input is above or below the line
    return x**3/100


def activation(x):
    # a sigmoid activation function - written in this form to ensure there is no overflow error for large negative x
    return np.where(x >= 0, 1 / (1 + np.exp(-x)), np.exp(x) / (1 + np.exp(x)))


def activation_derivative(x):
    return np.exp(-x)/(1+np.exp(-x))**2


class neural_network():
    # can specify shape of neural network i.e (2,32,256,2)
    def __init__(self, shape, learn_rate=0.01):
        self.shape = shape
        self.learn_rate = learn_rate
        self.weights = []  # each weight is matrix - number of columns is number of inputs for each layer
        self.biases = []
        for i in range(len(shape)-1):
            weight = -1+2*np.random.rand(shape[i+1], shape[i])
            bias = -1+2*np.random.rand(shape[i+1]).T
            self.weights.append(weight)
            self.biases.append(bias)
        # list of 2d matricies which are weights for each layer
        # initiate as random numbers between -1 and 1

    def process_layers(self, inputs, return_nodes=False):
        # when return_nodes is true, value for each node is recorded to be used in back propogation
        # may be a simpiler solution without this
        nodes = [inputs]
        for i in range(len(self.shape)-1):
            # would this work with matrix of inputs? i.e batch of inputs. could then recieve a matrix of outputs?
            wx = np.dot(self.weights[i], inputs) + self.biases[i]
            if return_nodes:
                nodes.append(wx)
            inputs = activation(wx)
        if return_nodes:
            return inputs, nodes
        return inputs

    def back_propogate(self, nodes, cost):
        '''
        want a partial derivative for each set of nodes apart from input ones - at point before the activation is applied
        also need values of nodes before activation at each layer for the activation derivative - may be easier to store as part of class
        '''
        partial = 2*cost * activation_derivative(nodes[-1])
        self.weights[-1] -= partial[:, np.newaxis] * nodes[-2][np.newaxis, :] * self.learn_rate
        self.biases[-1] -= partial*self.learn_rate
        # -= since we want it to travel down the slope
        for i in range(-2, -1*len(self.shape), -1):
            # can ammend weights and biases here
            partial = np.dot(self.weights[i+1].T, partial) * activation_derivative(nodes[i])
            self.weights[i] -= partial[:, np.newaxis] * nodes[i-1][np.newaxis, :] * self.learn_rate
            self.biases[i] -= partial * self.learn_rate
            # change in weight[i]jk is partial[i]j * node[i]k
            # change in bias[i]j is partial[i]j

    def train(self, init_inputs, batch_size, expected):

        batches = np.ceil(len(init_inputs)/batch_size)
        inputs = np.array_split(init_inputs, batches)  # split inputs into batches
        expected = np.array_split(expected, batches)
        total_nodes = [[]]*batch_size
        correct = 0
        cost = 0
        for index1, batch in enumerate(inputs):
            used_cost = 0
            for index2, Input in enumerate(batch):
                output, total_nodes[index2] = self.process_layers(Input, True)
                if np.argmax(output) == expected[index1][index2][1]:
                    correct += 1
                used_cost += output-expected[index1][index2]
                cost += np.sum((output-expected[index1][index2])**2)
            used_cost = used_cost/len(batch)

            # note that batch learning does not work as well as intended - issue with implementation
            for i in range(len(batch)):
                self.back_propogate(total_nodes[i], used_cost)

        print()
        print('percentage correct: {}%'.format(correct*100/len(init_inputs)))
        print('average cost is {}'.format(cost*100/len(init_inputs)))
        print()

    def test(self, inputs):
        '''
        for data not to be trained on
        get inputs, run through layers, see if correct, find cost
        find average cost
        '''
        return

    def save(self, file_name):
        '''
        save the weights and biases of trained model

        '''
        return


def train_numbers(net, n, batch_size):
    training_data = 10-20*np.random.rand(n, 2)
    expected1 = [training_data[:, 1] > function(training_data[:, 0])][0]
    expected = np.array(expected1, dtype=int)  # expected needs to be a 2d array - one for each output node
    expected = np.vstack((expected, 1 ^ expected)).T
    net.train(training_data, batch_size, expected)


if __name__ == '__main__':
    net = neural_network((2, 4, 2))
    # get different errors bases on 10 or 1 as input

    #train(100000, 5)
