import { useEffect, useState } from "react";
import { getMovimientos } from "./services/movimientos.service";

function App() {
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    tipo: "ingreso",
    monto: "",
    fuente: "",
    fecha_movimiento: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchMovimientos = async () => {
    try {
      const data = await getMovimientos();
      setMovimientos(data.data);
    } catch {
      setError("No se pudieron cargar los movimientos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovimientos();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch("http://localhost:3000/movimientos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setForm({
      tipo: "ingreso",
      monto: "",
      fuente: "",
      fecha_movimiento: "",
    });

    fetchMovimientos();
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Movimientos</h1>

      <h2>Nuevo movimiento</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          name="tipo"
          placeholder="tipo"
          value={form.tipo}
          onChange={handleChange}
        />
        <input
          name="monto"
          placeholder="monto"
          value={form.monto}
          onChange={handleChange}
        />
        <input
          name="fuente"
          placeholder="fuente"
          value={form.fuente}
          onChange={handleChange}
        />
        <input
          type="date"
          name="fecha_movimiento"
          value={form.fecha_movimiento}
          onChange={handleChange}
        />
        <button type="submit">Agregar</button>
      </form>

      {movimientos.length === 0 && <p>No hay datos</p>}

      <ul>
        {movimientos.map((mov: any) => (
          <li key={mov.id}>
            {mov.tipo} — ${mov.monto}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;