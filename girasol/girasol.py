import math
import turtle

# Crear una ventana para dibujar el girasol
ventana = turtle.Screen()
ventana.title("Girasol")
ventana.bgcolor("black")

# Crear un objeto turtle para dibujar el girasol
girasol = turtle.Turtle()
girasol.shape("turtle")
girasol.speed(0)
girasol.fillcolor("brown")

# Dibuja el tallo
girasol.penup()
girasol.goto(0, -200)
girasol.pendown()
girasol.setheading(90)
girasol.fillcolor("green")
girasol.begin_fill()
girasol.forward(200)
girasol.left(90)
girasol.forward(20)
girasol.left(90)
girasol.forward(200)
girasol.end_fill()

# Cambia el color del centro del girasol a café más claro (RGB: 139, 69, 19)
girasol.penup()
girasol.goto(0, -180)
girasol.fillcolor("#8B4513")
girasol.begin_fill()
girasol.circle(0)
girasol.end_fill()

# Código del girasol (el que proporcionaste)
phi = 137.508 * (math.pi / 180.0)
for i in range(160 + 40):
    r = 4 * math.sqrt(i)
    theta = i * phi
    x = r * math.cos(theta)
    y = r * math.sin(theta)
    girasol.penup()
    girasol.goto(x, y)
    girasol.setheading(i * 137.508)
    girasol.pendown()
    if i < 160:
        girasol.stamp()
    else:
        girasol.fillcolor("yellow")
        girasol.begin_fill()
        girasol.right(20)
        girasol.forward(70)
        girasol.left(40)
        girasol.forward(70)
        girasol.left(140)
        girasol.forward(70)
        girasol.left(40)
        girasol.forward(70)
        girasol.end_fill()

# Escribe "Te Quiero" en la parte superior del girasol
girasol.penup()
girasol.goto(0, 250)
girasol.color("purple")
girasol.write("Te Amo", align="center", font=("Arial", 24, "bold"))

# Oculta el cursor de la tortuga antes de salir
girasol.hideturtle()

# Permite cerrar la ventana haciendo clic en ella
ventana.exitonclick()

