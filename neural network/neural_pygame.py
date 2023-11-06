import numpy as np
import pygame
import neural


pygame.init()
SCREEN_SIZE = 100
window = pygame.display.set_mode((SCREEN_SIZE, SCREEN_SIZE))


def convert_to_screen(x, y):
    x = (x+10)*SCREEN_SIZE/20
    y = (-y+10)*SCREEN_SIZE/20
    return x, y


def convert_from_screen(x, y):
    x = (x-SCREEN_SIZE/2)*20/SCREEN_SIZE
    y = (-y + SCREEN_SIZE/2)*20/SCREEN_SIZE
    return x, y


def draw_window(net_instance):
    pixel_array = pygame.PixelArray(window)
    for x in range(SCREEN_SIZE):
        for y in range(SCREEN_SIZE):
            output = net_instance.process_layers(20*np.array([x-SCREEN_SIZE/2, SCREEN_SIZE/2-y])/SCREEN_SIZE)
            value = np.argmax(output)
            colour = (255*value, 0, 255*(1-value))
            pixel_array[x, y] = colour
        calculated_y = neural.function((x-SCREEN_SIZE/2)*20/SCREEN_SIZE)
        real_y = round((-calculated_y+10)*SCREEN_SIZE/20)
        if real_y < SCREEN_SIZE and real_y >= 0:
            pixel_array[x, real_y] = (0, 0, 0)
    pixel_array.close()


def display():
    global training_data
    net = neural.neural_network((2, 4, 4, 2), 0.001)
    clock = pygame.time.Clock()
    run = True
    training_data = np.empty((SCREEN_SIZE*SCREEN_SIZE, 2))
    for x in range(SCREEN_SIZE):
        for y in range(SCREEN_SIZE):
            training_data[x*SCREEN_SIZE+y] = 20*np.array([x-SCREEN_SIZE/2, SCREEN_SIZE/2-y])/SCREEN_SIZE
    shuffled_index = np.arange(len(training_data))
    np.random.shuffle(shuffled_index)
    training_data = training_data[shuffled_index]
    expected1 = [training_data[:, 1] > neural.function(training_data[:, 0])][0]
    expected = np.array(expected1, dtype=int)  # expected needs to be a 2d array - one for each output node
    expected = np.vstack((expected, 1 ^ expected)).T
    while run:
        clock.tick(10)
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                run = False

        draw_window(net)
        pygame.display.update()
        net.train(training_data, 4, expected)

    pygame.quit()


training_data = []
display()
