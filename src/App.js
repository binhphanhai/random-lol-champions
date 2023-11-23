import logo from "./logo.png";
import "./App.css";
import { Card, Form, InputNumber, Select, Button, message } from "antd";
import { CHAMPIONS, CHAMPION_IMAGES } from "./data";
import { useCallback, useState } from "react";
import { CopyOutlined } from "@ant-design/icons";

const options = CHAMPIONS.map((name) => ({ label: name, value: name }));

const random = (n, ignoredList) => {
  const rs = [];
  for (let i = 0; i < n; i++) {
    const item = CHAMPIONS[Math.floor(Math.random() * CHAMPIONS.length)];
    if (rs.includes(item) || ignoredList.includes(item)) {
      i--;
    } else {
      rs.push(item);
    }
  }
  return rs;
};

function App() {
  const [form] = Form.useForm();
  const q = Form.useWatch("quantity", form);
  const quantity = parseInt(q, 10);
  const b = Form.useWatch("bonus", form);
  const bonus = parseInt(b, 10) || 0;

  const [champions, setChampions] = useState([]);
  const [championsQuantity, setChampionsQuantity] = useState(undefined);

  const teams = [
    champions.slice(0, championsQuantity),
    champions.slice(championsQuantity, championsQuantity * 2 + bonus),
  ];

  const onRandom = useCallback(
    (values) => {
      setChampions(random(quantity * 2 + bonus, values.banned || []));
      setChampionsQuantity(quantity);
    },
    [bonus, quantity]
  );

  const copyChampions = (team) => {
    navigator.clipboard.writeText(teams[team].join(", "));
    message.success("Copied!");
  };

  return (
    <div className="app">
      <nav className="app-header">
        <img src={logo} className="app-logo" alt="logo" />
        <div>Random LoL Champions</div>
      </nav>
      <div className="main">
        <Card style={{ width: "90%", maxWidth: "1400px" }}>
          <Form layout="inline" onFinish={onRandom} form={form}>
            <Form.Item label="Quantity of Champions" name="quantity">
              <InputNumber placeholder="Exp: 10" min={5} max={40} />
            </Form.Item>
            <Form.Item label="Weak team bonus" name="bonus">
              <InputNumber placeholder="Exp: 2" min={0} max={20} />
            </Form.Item>
            <Form.Item label="Banned Champions" name="banned">
              <Select
                mode="multiple"
                allowClear
                style={{ width: "300px" }}
                placeholder="Banned"
                options={options}
                maxTagCount={2}
              />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={
                quantity === undefined ||
                Number.isNaN(quantity) ||
                quantity < 5 ||
                quantity > 40
              }
            >
              Random
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
                setChampionsQuantity(undefined);
              }}
              style={{ marginLeft: 12 }}
            >
              Clear
            </Button>
          </Form>
        </Card>
        <Card style={{ width: "90%", maxWidth: "1400px", flexGrow: 1 }}>
          {championsQuantity !== undefined && (
            <div>
              <div>
                <div>
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: 24,
                    }}
                  >
                    Team 1{" "}
                  </span>
                  <CopyOutlined
                    style={{ fontSize: 20, cursor: "pointer" }}
                    onClick={copyChampions.bind(this, 0)}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                >
                  {teams[0].map((champion) => (
                    <Card
                      style={{ width: 140, height: 180 }}
                      bodyStyle={{ padding: 0 }}
                    >
                      <img
                        width={138}
                        height={138}
                        src={CHAMPION_IMAGES[champion]}
                        alt={champion}
                        key={champion}
                        style={{
                          borderTopLeftRadius: 8,
                          borderTopRightRadius: 8,
                          objectFit: "cover",
                        }}
                      />
                      <div style={{ textAlign: "center", fontWeight: "bold" }}>
                        {champion}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 40 }}>
                <div>
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: 24,
                    }}
                  >
                    Team 2{" "}
                  </span>
                  <CopyOutlined
                    style={{ fontSize: 20, cursor: "pointer" }}
                    onClick={copyChampions.bind(this, 1)}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                  }}
                >
                  {teams[1].map((champion) => (
                    <Card
                      style={{ width: 140, height: 180 }}
                      bodyStyle={{ padding: 0 }}
                    >
                      <img
                        width={138}
                        height={138}
                        src={CHAMPION_IMAGES[champion]}
                        alt={champion}
                        key={champion}
                        style={{
                          borderTopLeftRadius: 8,
                          borderTopRightRadius: 8,
                          objectFit: "cover",
                        }}
                      />
                      <div style={{ textAlign: "center", fontWeight: "bold" }}>
                        {champion}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default App;