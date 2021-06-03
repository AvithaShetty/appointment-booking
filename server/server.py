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

@app.route("/get_dept/<dept>", methods=['GET'])
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

@app.route('/success/<name>')
def success(name):
   return 'welcome %s' % name

@app.route("/register", methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
      user = request.form['ID']
    else:
      user = request.args.get('ID')
    print(user)
    return render_template('home.html')



# don't modify below here
if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)