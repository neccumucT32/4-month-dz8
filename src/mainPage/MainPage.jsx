import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import ModalWindow from "../components/ModalWindow";

const URL = "http://localhost:8000/users";

function MainPage() {
  const [users, setUsers] = useState([]);
  const [modalMessage, setModalMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(URL);
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const createUser = async (data) => {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const newUser = await response.json();
    setUsers([...users, newUser]);
    setModalMessage("Пользователь успешно создан");
    reset();
  };

  const deleteUser = async (userId) => {
    await fetch(`${URL}/${userId}`, {
      method: "DELETE",
    });
    setUsers(users.filter((user) => user.id !== userId));
    setModalMessage("Пользователь удален");
  };

  const onSubmit = (data) => {
    createUser(data);
  };

  return (
    <div>
      <h1>Управление пользователями</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Введите имя"
          {...register("name", { required: "Это поле обязательно" })}
        />
        {errors.name && <small>{errors.name.message}</small>}

        <input
          type="text"
          placeholder="Введите email"
          {...register("email", { required: "Это поле обязательно" })}
        />
        {errors.email && <small>{errors.email.message}</small>}

        <input
          type="text"
          placeholder="Введите фамилию"
          {...register("username", { required: "Это поле обязательно" })}
        />
        {errors.username && <small>{errors.username.message}</small>}

        <button type="submit">Создать</button>
      </form>

      {users.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>
                  <button onClick={() => deleteUser(user.id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Список пуст</p>
      )}

      {modalMessage && <ModalWindow message={modalMessage} />}
    </div>
  );
}

export default MainPage;
