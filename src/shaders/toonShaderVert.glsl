uniform float thickness;

void main() 
{
    vec3 newPosition = position + normal * thickness;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1);
}