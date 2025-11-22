let container;
let camera, scene, renderer;
let uniforms;

function init() {
    container = document.getElementById("bg");

    //🔍 Проверка на мобильное устройство
    const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );

    //🔍 Заморозка по пропорции экрана (как в CSS)
    const isNarrow = window.innerWidth / window.innerHeight < 1.1;

    camera = new THREE.Camera();
    camera.position.z = 1;

    scene = new THREE.Scene();

    var geometry = new THREE.PlaneBufferGeometry(2, 2);

    uniforms = {
        u_time: { type: "f", value: 2001.0 },
        u_resolution: { type: "v2", value: new THREE.Vector2() },
        u_mouse: { type: "v2", value: new THREE.Vector2() },
        u_complex: { type: "b", value: false },
    };

    var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: shader.vertex,
        fragmentShader: shader.fragment,
    });

    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    container.appendChild(renderer.domElement);

    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);

    // ✅ Только если НЕ мобильное — слушаем мышь
    if (!isMobile && !isNarrow) {
        document.onmousemove = function (e) {
            uniforms.u_mouse.value.x = e.pageX;
            uniforms.u_mouse.value.y = e.pageY;
        };
        animate();
    } else {
        // Мобильное: один рендер и всё
        render();
        // 🚫 Не обновляем mouse после этого
        // Можно даже: document.onmousemove = null;
    }
}

function onWindowResize(event) {
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    uniforms.u_resolution.value.x = renderer.domElement.width;
    uniforms.u_resolution.value.y = renderer.domElement.height;

    // 🔁 Если мобильное — перерисовать ОДИН раз после ресайза
    render();
}

// ✅ Функция animate нужна — и она вызывается!
function animate() {
    requestAnimationFrame(animate); // ← продолжает цикл
    render();
}

function render() {
    uniforms.u_time.value += 0.05 * (1 + uniforms.u_mouse.value.x / 100000);
    renderer.render(scene, camera);
}

init();
