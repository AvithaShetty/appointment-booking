from flask import Flask, jsonify, request, redirect, url_for, render_template
import pyodbc


server = "wefeelfine.database.windows.net"
database = "myHospital"
username = "wefeelfineadmin"
password = "wefeelfine@123"
database_name = "[sources]"
table = "twitter"
connectionString = f"""DRIVER={{SQL Server}};
                      SERVER={server};
                      DATABASE={database};
                      UID={username};
                      PWD={password};"""



app = Flask(__name__)
# don't modify above here

@app.route("/get_doctors/<dept>", methods=['GET'])
def send(dept):
    cnxn = pyodbc.connect(connectionString)
    cursor = cnxn.cursor()
    cursor.execute("SELECT * FROM DOCTOR WHERE DEPARTMENT = (?)", (dept,))
    columns = [column[0] for column in cursor.description]
    rows = cursor.fetchall()
    count = len(rows)
    results = []
    for row in rows:
        results.append( dict(zip(columns, row)) )

    # don't modify this

    cursor.commit()
    cnxn.close()
    response = jsonify({"number":count,"results":results})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route("/get_test", methods=['GET'])
def test():
    cnxn = pyodbc.connect(connectionString)
    cursor = cnxn.cursor()
    cursor.execute("SELECT * FROM TEST")
    columns = [column[0] for column in cursor.description]
    rows = cursor.fetchall()
    count = len(rows)
    results = []
    for row in rows:
        results.append( dict(zip(columns, row)) )

    # don't modify this
    cursor.commit()
    cnxn.close()
    response = jsonify({"number":count,"results":results})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route("/get_medicine", methods=['GET'])
def med():
    cnxn = pyodbc.connect(connectionString)
    cursor = cnxn.cursor()
    cursor.execute("SELECT * FROM MEDICINE")
    columns = [column[0] for column in cursor.description]
    rows = cursor.fetchall()
    count = len(rows)
    results = []
    for row in rows:
        results.append( dict(zip(columns, row)) )

    # don't modify this
    cursor.commit()
    cnxn.close()
    response = jsonify({"number":count,"results":results})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route('/success/<name>')
def success(name):
   return 'welcome %s' % name

@app.route('/get_departments' , methods=['GET']) 
def dept():
    cnxn = pyodbc.connect(connectionString)
    cursor = cnxn.cursor()
    cursor.execute("SELECT DEPARTMENT as dept FROM DOCTOR GROUP BY DEPARTMENT ")
    columns = [column[0] for column in cursor.description]
    rows = cursor.fetchall()
    count = len(rows)
    results = []
    for row in rows:
        results.append( dict(zip(columns, row)) )

    # don't modify this
    cursor.commit()
    cnxn.close()
    response = jsonify({"number":count,"results":results})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route('/validate', methods=["POST"])
def validateLogin():
    username = str(request.form['username'])
    password = str(request.form['password'])
    print(username, password)
    cnxn = pyodbc.connect(connectionString)
    cursor = cnxn.cursor()
    sql = """
        DECLARE	@responseMessage nvarchar(250)
        DECLARE @responseCode INT

        EXEC dbo.Login
            @pLoginName = ?,
            @pPassword = ?,
            @responseMessage = @responseMessage OUTPUT,
            @responseCode = @responseCode OUTPUT

        SELECT	@responseMessage as N'message', @responseCode as N'code';"""
    cursor.execute(sql, (username, password))
    columns = [column[0] for column in cursor.description]
    rows = cursor.fetchall()
    count = len(rows)
    results = []
    for row in rows:
        results.append( dict(zip(columns, row)) )

    # don't modify this
    cursor.commit()
    cnxn.close()
    response = jsonify({"results":results, 'redirect_url':'./home.html'})
    print(results[0]["message"])
    response.headers.add("Access-Control-Allow-Origin", "*")
    print(results[0]["code"], type(results[0]["code"]))
    return response
    
@app.route('/register', methods=["POST"])
def register():
    username = str(request.form['ID'])
    password = str(request.form['pass'])
    firstName = str(request.form['first-name'])
    LastName = str(request.form['last-name'])
    print(username, password)
    cnxn = pyodbc.connect(connectionString)
    cursor = cnxn.cursor()
    sql = """
        DECLARE @responseMessage NVARCHAR(250)
        DECLARE @responseCode INT
        EXEC dbo.AddUser
          @pLogin = ?,
          @pPassword = ?,
          @pFirstName = ?,
          @pLastName = ?,
          @responseMessage=@responseMessage OUTPUT,
          @responseCode = @responseCode OUTPUT

        SELECT	@responseMessage as N'message', @responseCode as N'code';"""
    cursor.execute(sql, (username, password, firstName, LastName ))
    columns = [column[0] for column in cursor.description]
    rows = cursor.fetchall()
    count = len(rows)
    results = []
    for row in rows:
        results.append( dict(zip(columns, row)) )

    # don't modify this
    cursor.commit()
    cnxn.close()
    print(results[0]["code"], results[0]['message'])

    if (results[0]["code"] == 0 and results[0]["message"].find("Violation of UNIQUE KEY constraint") != -1):
        results[0]["message"] = "User already exists";
    response = jsonify({"results":results, 'redirect_url':'./home.html'})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


# don't modify below here
if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)