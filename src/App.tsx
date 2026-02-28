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

  const [editId, setEditId] = useState<number | null>(null);

  const handleEdit = (mov: any) => {
    setEditId(mov.id);
    setForm({
      tipo: mov.tipo,
      monto: mov.monto,
      fuente: mov.fuente,
      fecha_movimiento: mov.fecha_movimiento?.split("T")[0],
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const url = editId
      ? `http://localhost:3000/movimientos/${editId}`
      : `http://localhost:3000/movimientos`;

    const method = editId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({
      tipo: "ingreso",
      monto: "",
      fuente: "",
      fecha_movimiento: "",
    });

    setEditId(null);
    fetchMovimientos();
  };

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

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:3000/movimientos/${id}`, {
      method: "DELETE",
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
        <button type="submit">
          {editId ? "Actualizar" : "Agregar"}
        </button>
      </form>

      {movimientos.length === 0 && <p>No hay datos</p>}

      <ul>
        {movimientos.map((mov: any) => (
          <li key={mov.id}>
            {mov.tipo} — ${mov.monto}
            <button
              style={{ marginLeft: 10 }}
              onClick={() => handleEdit(mov)}
            >
              Editar
            </button>
            <button
              style={{ marginLeft: 10 }}
              onClick={() => handleDelete(mov.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;