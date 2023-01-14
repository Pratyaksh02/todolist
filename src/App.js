import React from "react";
import { Layout, Table, Menu, Button, Tag, DatePicker } from "antd";
import { Modal, Form, Input, Select } from "antd";
import { theme } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { Pagination } from "antd";
const { Header, Content } = Layout;
const { Search } = Input;
function App() {
  <link
    href="https://fonts.googleapis.com/icon?family=Material+Icons"
    rel="stylesheet"
  ></link>;
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [modalAddTitle, setModalAddTitle] = useState("Create Task");
  const [modalEditTitle, setModalEditTitle] = useState("Update Task");
  const [tasks, setTasks] = useState([]);
  const [timestamp, setTimestamp] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [status, setStatus] = useState([]);
  // const [tags, setTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [statusError, setStatusError] = useState([]);
  const [taskId, setTaskId] = useState(null);
  const [dueDateError, setDueDateError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [editingTaskId, setEditingTaskId] = useState([]);
  const [sortOrder, setSortOrder] = useState({
    column: "status",
    order: "ascend",
  });
  useEffect(() => {
    axios.get("http://localhost:4000/tasks").then((res) => {
      //console.log(res);
      setTasks(res.data);
    });
  }, []);

  useEffect(() => {
    const dateMs = Date.now();
    // console.log(dateMs);
    const date = new Date(dateMs);
    const dateFinal =
      date.getDate() + "/" + date.getMonth() + 1 + "/" + date.getFullYear();
    // console.log(dateFinal);
    setTimestamp(dateFinal);
  }, [modalAddVisible]);

  const columns = [
    {
      title: "Timestamp",
      dataIndex: "timestamp",
    },
    {
      title: "Title",
      dataIndex: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Description",
      dataIndex: "description",
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
    },
    // {
    //   title: "Tags",
    //   dataIndex: "tags",
    //   render: (_, { tags }) => (
    //     <>
    //       {tags.map((tag) => {
    //         let color = tag.length > 5 ? "geekblue" : "green";
    //         if (tag === "loser") {
    //           color = "volcano";
    //         }
    //         return (
    //           <Tag color={color} key={tag}>
    //             {tag.toUpperCase()}
    //           </Tag>
    //         );
    //       })}
    //     </>
    //   ),
    // },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Edit",
      render: (text, record) => (
        <Button
          shape="round"
          onClick={() => handleEditTask(record.id)}
          style={{ color: "darkolivegreen", borderColor: "darkolivegreen" }}
        >
          <FaEdit />
        </Button>
      ),
    },
    {
      title: "Delete",
      render: (text, task) => (
        <Button shape="round" danger onClick={() => handleDeleteClick(task.id)}>
          <FaTrashAlt />
        </Button>
      ),
    },
  ];

  const columnsSearch = [
    {
      title: "Timestamp",
      dataIndex: "timestamp",
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  const handleSort = () => {
    setSortOrder((prevState) => ({
      ...prevState,
      order: prevState.order === "ascend" ? "descend" : "ascend",
    }));
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    let filteredData = tasks.filter((task) => {
      return (
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.dueDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredTasks(filteredData);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const paginatedTasks = tasks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDeleteClick = (id) => {
    setTaskId(id);
    setConfirmVisible(true);
  };

  const handleEditTask = (id) => {
    // fetch the task data using id
    setDescriptionError("");
    setDueDateError("");
    setTitleError("");
    setStatusError("");
    axios
      .get(`http://localhost:4000/tasks/${id}`)
      .then((res) => {
        setTimestamp(res.data.timestamp);
        setTitle(res.data.title);
        setDescription(res.data.description);
        setDueDate(res.data.dueDate);
        setStatus(res.data.status);
        setModalEditVisible(true);
        setEditingTaskId(id);
      })
      .catch((err) => console.log(err));
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    const value = event.target.value;

    setTitle(value);
    if (!value) {
      setTitleError("Title is required");
    } else {
      setTitleError("");
    }
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
    const value = event.target.value;
    setDescription(value);
    if (!value) {
      setDescriptionError("Description is required");
    } else {
      setDescriptionError("");
    }
  };

  const handleDueDateChange = (event) => {
    const value = event.target.value;
    if (!value) {
      setDueDateError("Due date is required");
    } else {
      setDueDateError("");
    }
    const date = moment(value, "DD/MM/YYYY", true);
    if (date.isValid()) {
      setDueDate(value);
    } else {
      setDueDateError("Invalid date format, please enter in DD/MM/YYYY format");
    }
    if (value < timestamp) {
      setDueDateError("Due date should be after the timestamp");
      alert("Due date should be after the timestamp");
      setDueDateError("");
    } else {
      setDueDateError("");
    }
    setDueDate(event.target.value);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    if (!value) {
      setStatusError("Status is required");
    } else {
      setStatusError("");
    }
  };

  const handleSubmit = () => {
    if (!title || !description || !dueDate || !status) {
      alert("All fields are required");
      setModalEditVisible(false);
      return;
    }
    if (editingTaskId) {
      handleUpdateTask();
    }

    setModalEditVisible(false);
  };

  const handleOpenCreateModal = () => {
    setDescriptionError("");
    setDueDateError("");
    setTitleError("");
    setStatusError("");
    setTimestamp(new Date());
    setTitle("");
    setDescription("");
    setDueDate("");
    setStatus("Open");
    setModalAddVisible(true);
  };

  const handleCancel = () => {
    setModalAddVisible(false);
  };

  const handleOk = () => {
    if (!title || !description || !dueDate || !status) {
      alert("All fields are required");
      setModalAddVisible(false);
      return;
    }
    //API call to create task

    handleCreateTask();
    setModalAddVisible(false);
  };
  // const validateDueDate = (_, value) => {
  //   const timestamp = new Date();
  //   if (new Date(value) < timestamp) {
  //     return Promise.reject("Due date should be after the timestamp");
  //   }
  //   return Promise.resolve();
  // };
  const handleCreateTask = () => {
    axios
      .post("http://localhost:4000/tasks", {
        timestamp: timestamp,
        title: title,
        description: description,
        dueDate: dueDate,
        status: status,
      })
      .then((res) => {
        setTasks([...tasks, res.data]);
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateTask = () => {
    axios
      .put(`http://localhost:4000/tasks/${editingTaskId}`, {
        timestamp: timestamp,
        title: title,
        description: description,
        dueDate: dueDate,
        status: status,
      })
      .then((res) => {
        //update the task in state
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === editingTaskId ? res.data : task))
        );
      })
      .catch((err) => console.log(err));
    setModalEditVisible(false);
  };

  const handleDeleteTask = () => {
    axios
      .delete(`http://localhost:4000/tasks/${taskId}`)
      .then((res) => {
        // handle success
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        setTasks(updatedTasks);
        setConfirmVisible(false);
      })
      .catch((err) => {
        // handle error
        console.log(err);
      });
  };

  return (
    <Layout className="layout">
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "94%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Menu theme="dark" mode="horizontal">
          <Menu.Item>
            <b>TO-DO List</b>
          </Menu.Item>
          <Menu.Item>
            {/* <Table dataSource={filteredTasks} columns={columns} /> */}
          </Menu.Item>
        </Menu>
      </Header>
      <Content
        style={{
          padding: "0 50px",
          marginTop: "50px",
        }}
      >
        <div
          className="site-layout-content"
          style={{
            background: colorBgContainer,
          }}
        >
          <div>
            <Search
              placeholder="input search text"
              value={searchTerm}
              onSearch={(value) => handleSearch(value)}
              allowClear
              color="inherit"
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                width: 200,
                float: "right",
                marginTop: "20px",
                marginRight: "355px",
                marginBottom: "20px",
                background: "inherit",
              }}
            />
            {searchTerm.length > 0 && (
              <Table
                dataSource={filteredTasks}
                columns={columnsSearch}
                pagination={false}
                size="small"
                style={{
                  width: "50%",
                  marginLeft: "auto",
                  marginRight: "auto",

                  shapeOutside: "border-box",
                }}
              />
            )}
          </div>

          <div>
            <Button
              shape="round"
              onClick={handleOpenCreateModal}
              style={{
                float: "left",
                marginTop: "20px",
                marginBottom: "15px",
                marginLeft: "30px",
                color: "darkgreen",

                borderColor: "darkgreen",
              }}
            >
              <b>
                <FaPlus /> Add
              </b>
            </Button>
          </div>

          <Table
            dataSource={paginatedTasks}
            columns={columns}
            pagination={false}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            onChange={handlePageChange}
            onShowSizeChange={handlePageSizeChange}
            showSizeChanger={true}
            total={tasks.length}
            style={{ marginTop: "20px", marginLeft: "560px" }}
          />
          <Modal
            visible={modalEditVisible}
            onCancel={() => setModalEditVisible(false)}
            onOk={() => handleSubmit()}
            title={modalEditTitle}
          >
            <Form>
              <Form.Item
                label="Title"
                validateStatus={titleError ? "error" : ""}
                help={titleError}
              >
                <Input
                  value={title}
                  maxLength="100"
                  onChange={handleTitleChange}
                />
              </Form.Item>
              <Form.Item
                label="Description"
                validateStatus={descriptionError ? "error" : ""}
                help={descriptionError}
              >
                <Input
                  value={description}
                  maxLength={1000}
                  onChange={handleDescriptionChange}
                />
              </Form.Item>
              <Form.Item
                label="Due Date"
                validateStatus={dueDateError ? "error" : ""}
                help={dueDateError}
              >
                <Input value={dueDate} onChange={handleDueDateChange} />
              </Form.Item>
              <Form.Item
                label="Status"
                validateStatus={statusError ? "error" : ""}
                help={statusError}
              >
                <Select value={status} onChange={handleStatusChange}>
                  <Select.Option value="Open">Open</Select.Option>
                  <Select.Option value="Working">Working</Select.Option>
                  <Select.Option value="Done">Done</Select.Option>
                  <Select.Option value="Overdue">Overdue</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            title={modalAddTitle}
            visible={modalAddVisible}
            onCancel={handleCancel}
            onOk={handleOk}
          >
            <Form>
              <Form.Item label="Timestamp">
                <Input value={timestamp} disabled />
              </Form.Item>
              <Form.Item
                label="Title"
                validateStatus={titleError ? "error" : ""}
                help={titleError}
              >
                <Input
                  value={title}
                  onChange={handleTitleChange}
                  maxLength={100}
                />
              </Form.Item>
              <Form.Item
                label="Description"
                validateStatus={descriptionError ? "error" : ""}
                help={descriptionError}
              >
                <Input
                  value={description}
                  onChange={handleDescriptionChange}
                  maxLength={1000}
                />
              </Form.Item>
              <Form.Item
                label="Due Date"
                validateStatus={dueDateError ? "error" : ""}
                help={dueDateError}
              >
                <Input value={dueDate} onChange={handleDueDateChange} />
              </Form.Item>
              <Form.Item
                label="Status"
                validateStatus={statusError ? "error" : ""}
                help={statusError}
              >
                <Select
                  value={status}
                  onChange={handleStatusChange}
                  defaultValue="Open"
                >
                  <Select.Option value="Open">Open</Select.Option>
                  <Select.Option value="Working">Working</Select.Option>
                  <Select.Option value="Done">Done</Select.Option>
                  <Select.Option value="Overdue">Overdue</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            visible={confirmVisible}
            onOk={handleDeleteTask}
            onCancel={() => setConfirmVisible(false)}
            okText="Yes"
            cancelText="No"
          >
            <p>Are you sure you want to delete this task?</p>
          </Modal>
        </div>
      </Content>
    </Layout>
  );
}

export default App;
