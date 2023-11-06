import numpy as np
import matplotlib.pyplot as plt
import scipy
import os

# possibly need to change this (depends on which method used)
MOTOR_SPEED = 9.60e-5
DISTANCE = 0.44
WAVELENGTH = 635e-9
INITIAL_VALUES = {"defult": np.array(
    [1e-5, 1e-4]), 1: np.array([6e-6, 5.5e-5]), 7: np.array([3.8e-6, 4.1e-5]), 8: np.array([7e-6, 5e-5])}
# initial parameters for the curve sitting method
BOUNDS = np.array([[2, 0.001, 1e-6, 1e-5], [7, 5, 5e-3, 1e-3]])
# bounds for the curve fitting method
SLIT_NUMBERS = [[1, [13, 15, 17, 20]], [2, [1, 9]], [5, [7]], [10, [8]]]
# first item is the number of slits, second is the slit identifier


def single_slit(x, I, middle, a):
    return I*np.sinc(np.pi*a*(x-middle)/WAVELENGTH)**2


def multiple_slit2(x, I, middle, a, d=1):
    # note not used anymore but kept as this method could be useful in a future lab
    term1 = np.sinc(np.pi*a*(x-middle)/WAVELENGTH)**2
    inside_bracket = np.pi*d*(x-middle)/WAVELENGTH
    term2 = n*np.sin(n*inside_bracket)**2
    term3 = n*np.sin(np.pi*d*(x-middle)/WAVELENGTH)**2
    term2 = np.where(term3 == 0, n, term2)
    term3 = np.where(term3 == 0, 1, term3)
    # want to remove possibility of division by 0
    intensity = np.where(term3 == 0, I, I*term1*term2/term3)
    return intensity


def multiple_slit(x, I, middle, a, d=1):
    # multiple slit function used in main program
    # use sinc functions since 1/sinc(x) is defined for x = 0
    # this can be derived by considering the fourier transform of multiple slits
    term1 = np.sinc(np.pi*a*(x-middle)/WAVELENGTH)**2
    inside_bracket = d*(x-middle)/WAVELENGTH
    term2 = (np.sinc(n*inside_bracket))**2
    term3 = np.sinc(inside_bracket)**2
    return I*(term1*term2/term3)


def filter_data(file_name):
    # want to wait until it is fitted, then scale down by I so I is 1 and find midpoint
    # imports the data from a csv file and scales and filters it
    raw_data = np.genfromtxt(os.path.join('data', file_name), delimiter=",")
    data = raw_data[raw_data[:, 0] > 0]
    data[:, 0] = data[:, 0]*MOTOR_SPEED/DISTANCE
    data = data[data[:, 0].argsort()]
    median = scipy.signal.medfilt(data, (15, 1))  # generates a smoothed curve from the data
    # tweek 15 and the 0.1 if needed
    difference = np.abs(data[:, 1] - median[:, 1])
    filtered = data[np.where(difference < 0.1)]  # removes the data points that are far from the smoothed line - assumed anomalous
    # print(len(filtered))
    # plt.plot(data[:,0], data[:,1], "k") # option to plot original data
    return filtered


def trial(file_name):
    # trial function to optically compare the data to a curve with manually set parameters
    # not used in main, only used for setting up initial values and bounds where needed
    data = filter_data(file_name)
    middle = data[:, 0][np.argmax(data[:, 1])]
    height = np.max(data[:, 1])
    print(height)
    print(middle)
    p0 = (height, middle, 1e-4)
    x = np.linspace(data[:, 0][0], data[:, 0][-1], 10000)
    global n
    n = 1
    y = single_slit(x, *p0)
    plt.plot(data[:, 0], data[:, 1])
    plt.plot(x, y, "r")
    plt.show()


def output(file_name, parameters, units, array):
    # outputs the fitted parameters along with their uncertainties
    zeros = -1*np.floor(np.log10(array)).astype(int)
    print("For {} :".format(file_name))
    for i in range(len(array[0])):
        if array[0][i] < array[1][i] or array[1][i] >= 1:
            print(
                "{0} : {1:#.3g} +- {2:#.1g} {3}".format(parameters[i], *array[:, i], units[i]))
        elif zeros[0][i] < 4 or array[0][i] < array[1][i]:
            print("{0} : {1:#.{4}f} +- {2:#.{4}f} {3}".format(
                parameters[i], *array[:, i], units[i], zeros[1][i]))
        else:
            dif = zeros[1][i]-zeros[0][i]
            # print("{0} : {1:#.{4}e} +- {2:.0g} {3}".format(parameters[i], *array[:,i], units[i], dif))
            print("{0} : {1:#.{4}e} +- {2:.{4}f}e-{5:#02d} {3}".format(
                parameters[i], array[0][i], array[1][i]*10**zeros[0][i], units[i], dif, zeros[0][i]))
    print()


def find_values(slit_number, p0, bounds):
    global n
    file_name = "n{}_slit_{}_data.csv".format(n, slit_number)
    data = filter_data(file_name)
    middle = data[:, 0][np.argmax(data[:, 1])]  # centers data along maximum
    height = np.max(data[:, 1])
    bounds[0][0] = height

    if n == 1:  # i.e single slit
        p0 = p0[:1]
        bounds = bounds[:, :3]

    p0 = np.hstack(([height, middle], p0))  # set initial parameters
    result = scipy.optimize.curve_fit(
        multiple_slit, data[:, 0], data[:, 1], p0=p0, bounds=bounds, maxfev=10000)  # call curve fit algotithm
    uncer = np.sqrt(np.diag(result[1]))

    output(file_name, ["I", "a", "d"], ["V", "m", "m"],
           np.delete([result[0], uncer], 1, 1))  # output results

    data[:, 0] = data[:, 0]-result[0][1]
    data[:, 1] = data[:, 1]/result[0][0]  # normalise intensity
    fig = plt.figure()
    ax = fig.add_subplot(111)
    ax.FontSize = 6
    ax.minorticks_on()
    ax.grid(which='major', linewidth=1)
    ax.grid(which='minor', linewidth=0.3)
    x = np.linspace(data[:, 0][0], data[:, 0][-1], 10000)
    ax.plot(data[:, 0], data[:, 1], "k", linewidth=2, label="raw data")
    # plot raw data
    if n > 1:
        y2 = multiple_slit(x, 1, 0, *result[0][2:])
        ax.plot(x, y2, "b", linewidth=0.7, label="fitted difraction pattern")
        # plot multiple slit diffraction pattern

    y = single_slit(x, 1, 0, result[0][2])
    ax.plot(x, y, "r", linewidth=1, label="single slit diffraction pattern")
    ax.set_xlabel('theta [rad]')
    ax.set_ylabel('I/I(0)')
    ax.set_title(file_name)
    ax.legend(loc='upper right', fontsize=8)
    path = os.path.join('plots', f"n{n}_slit_{slit_number}_picture.png")
    plt.savefig(path, dpi=500)
    plt.show()
    # save figures with appropriate file names


def main():
    # calls the fitting proceedure for each slit
    for values in SLIT_NUMBERS:
        global n
        n = values[0]
        for slit_number in values[1]:
            p0 = INITIAL_VALUES.get(slit_number)
            if p0 is None:
                p0 = INITIAL_VALUES.get("defult")
            try:
                find_values(slit_number, p0, BOUNDS)
            except UnicodeDecodeError:
                print("UnicodeDecodeError reading in data for slit {} (n={})\n".format(
                    slit_number, n))
            except ValueError:
                print("Value Error for slit {} (n={}). This is likely as the height or midpoint is outside the bounds range \n". format(
                    slit_number, n))
            except OSError as error:
                print(error, "\n")


main()
# trial("n1_slit_20_data.csv")
